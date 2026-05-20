package com.example.demo.Security;

import com.example.demo.Role.Role;
import com.example.demo.Role.RoleRepository;
import com.example.demo.User.EmailVerificationService;
import com.example.demo.User.User;
import com.example.demo.User.UserRepository;
import com.example.demo.User.VerifyCodeRequest;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.time.LocalDateTime;
import java.util.Collections; // FIXED: Missing import added
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailVerificationService emailVerificationService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       JwtService jwtService, AuthenticationManager authenticationManager,
                       RoleRepository roleRepository, EmailVerificationService emailVerificationService) 
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.roleRepository = roleRepository;
        this.emailVerificationService = emailVerificationService;
    }

    public AuthResponse register(RegisterRequest request) {
        Role userRole = roleRepository.findByRoleName("CLIENT")
            .orElseThrow(() -> new RuntimeException("Role not found"));

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }

        String code = String.format("%06d", new Random().nextInt(999999));

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .phoneNum(request.getPhoneNum())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole) 
                .active(false) 
                .verificationCode(code) 
                .verificationExpiry(LocalDateTime.now().plusMinutes(15)) 
                .build();

        userRepository.save(user);

        try {
            emailVerificationService.sendVerificationEmail(user.getEmail(), code);
        } catch (Exception e) {
            System.err.println("WARNING: User saved, but verification email failed to dispatch: " + e.getMessage());
        }

        return AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        String identifier = request.getIdentifier();
        
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> {
                    if (identifier != null && identifier.matches("\\d+")) {
                        try {
                            int phone = Integer.parseInt(identifier);
                            return userRepository.findByPhoneNum(phone).orElse(null);
                        } catch (NumberFormatException e) {
                            return null; 
                        }
                    }
                    return null;
                });

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is inactive. Please verify your email first.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        var jwt = jwtService.generateToken(user);
        return AuthResponse.builder()
                   .token(jwt)
                   .role(user.getRole().getRoleName()) 
                   .username(user.getUsername())       
                   .email(user.getEmail())
                   .build();
    }

    public boolean verifyEmailCode(VerifyCodeRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User registration not found."));

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            throw new RuntimeException("Incorrect verification code.");
        }

        if (LocalDateTime.now().isAfter(user.getVerificationExpiry())) {
            throw new RuntimeException("Verification code has expired.");
        }

        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        return true;
    }

    // Remember to replace this with your real Developer Console credential string!
    private static final String GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

    public AuthResponse authenticateGoogleUser(String tokenId) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenId);
            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID Token.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                Role userRole = roleRepository.findByRoleName("CLIENT")
                        .orElseThrow(() -> new RuntimeException("Default CLIENT role not configured in database."));

                user = User.builder()
                        .username(name)
                        .email(email)
                        .phoneNum(null) 
                        .password(passwordEncoder.encode("OAUTH2_FEDERATED_ACCOUNT_PASSWORD_PLACEHOLDER"))
                        .role(userRole)
                        .active(true) // Google handles the user validation, bypass registration OTP check
                        .build();

                userRepository.save(user);
            }

            String jwt = jwtService.generateToken(user);
            
            return AuthResponse.builder()
                    .token(jwt)
                    .role(user.getRole().getRoleName())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}