package com.example.demo.Security;

import com.example.demo.Role.Role;
import com.example.demo.Role.RoleRepository;
import com.example.demo.User.EmailVerificationService;
import com.example.demo.User.User;
import com.example.demo.User.UserRepository;
import com.example.demo.User.VerifyCodeRequest ; 

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;





@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailVerificationService emailVerificationService; // 1. Inject email service

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       JwtService jwtService, AuthenticationManager authenticationManager,
                       RoleRepository roleRepository, EmailVerificationService emailVerificationService) 
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.roleRepository = roleRepository;
        this.emailVerificationService = emailVerificationService; // Assign it
    }



    public AuthResponse register(RegisterRequest request) {
        Role userRole = roleRepository.findByRoleName("CLIENT")
            .orElseThrow(() -> new RuntimeException("Role not found"));

        // 2. Generate the 6-digit verification code
        String code = String.format("%06d", new Random().nextInt(999999));

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .phoneNum(request.getPhoneNum())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole) 
                .active(false) // 3. Set to FALSE initially
                .verificationCode(code) // Set code (Make sure these setters exist in User entity)
                .verificationExpiry(LocalDateTime.now().plusMinutes(15)) // Set 15 min expiry
                .build();

        userRepository.save(user);

        // 4. Send the verification code via email
        emailVerificationService.sendVerificationEmail(user.getEmail(), code);

        // 5. Return an empty token or a message indicating registration success pending verification
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

        // 6. CRITICAL CHECK: Block authentication if account is not active
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
        throw new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found");
    }

    // 1. CRITICAL CHECK: Block authentication if account is not active
    // Using DisabledException tells Spring Security explicitly that the credentials might be okay, but the account is locked.
    if (!user.isActive()) {
        throw new org.springframework.security.authentication.DisabledException("Account is inactive. Please verify your email first.");
    }

    // 2. Check password ONLY if they are active
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new org.springframework.security.authentication.BadCredentialsException("Invalid credentials");
    }

    // 3. Issue Token
    var jwt = jwtService.generateToken(user);
    return AuthResponse.builder()
               .token(jwt)
               .role(user.getRole().getRoleName()) 
               .username(user.getUsername())       
               .email(user.getEmail())
               .build();
}


/* 
    public AuthResponse register(RegisterRequest request) {
        Role userRole = roleRepository.findByRoleName("CLIENT")
            .orElseThrow(() -> new RuntimeException("Role not found"));

        // 2. Generate the 6-digit verification code
        String code = String.format("%06d", new Random().nextInt(999999));

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .phoneNum(request.getPhoneNum())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole) 
                .active(false) // 3. Set to FALSE initially
                .verificationCode(code) // Set code (Make sure these setters exist in User entity)
                .verificationExpiry(LocalDateTime.now().plusMinutes(15)) // Set 15 min expiry
                .build();

        userRepository.save(user);

        // 4. Send the verification code via email
        emailVerificationService.sendVerificationEmail(user.getEmail(), code);

        // 5. Return an empty token or a message indicating registration success pending verification
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

        // 6. CRITICAL CHECK: Block authentication if account is not active
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

*/

    public boolean verifyEmailCode(VerifyCodeRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User registration not found."));

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            throw new RuntimeException("Incorrect verification code.");
        }

        if (LocalDateTime.now().isAfter(user.getVerificationExpiry())) {
            throw new RuntimeException("Verification code has expired.");
        }

        // Activate user and clear tracking data
        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        return true;
    }



}



/* 
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository ;

public AuthService (UserRepository userRepository, PasswordEncoder passwordEncoder, 
                    JwtService jwtService, AuthenticationManager authenticationManager,
                    RoleRepository roleRepository) 
{
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
    this.roleRepository = roleRepository; 
}


public AuthResponse register(RegisterRequest request) {
    Role userRole = roleRepository.findByRoleName("CLIENT")
        .orElseThrow(() -> new RuntimeException("Role not found"));

    var user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .phoneNum(request.getPhoneNum())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(userRole) 
            .active(true)
            .build();

    userRepository.save(user);
    var jwt = jwtService.generateToken(user);
    return AuthResponse.builder().token(jwt).build();
}


public AuthResponse authenticate(AuthRequest request) {
    String identifier = request.getIdentifier();
    
    // 1. Find user by Email or Phone using type-safe parsing in Java
    User user = userRepository.findByEmail(identifier)
            .orElseGet(() -> {
                // If not found by email, check if the identifier string is entirely numbers
                if (identifier != null && identifier.matches("\\d+")) {
                    try {
                        int phone = Integer.parseInt(identifier);
                        return userRepository.findByPhoneNum(phone).orElse(null);
                    } catch (NumberFormatException e) {
                        return null; // Fallback protection if number is too massive for an int
                    }
                }
                return null;
            });

    // 2. If neither search finds a record, throw the explicit exception
    if (user == null) {
        throw new RuntimeException("User not found");
    }


// 2. CRITICAL FIX: Match the raw password against the encrypted database password
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid credentials");
    }

    // 4. Everything matches! Generate and return your JWT token payload
    var jwt = jwtService.generateToken(user);
    return AuthResponse.builder()
                       .token(jwt)
                       .role(user.getRole().getRoleName()) 
                       .username(user.getUsername())       
                       .email(user.getEmail())
                       .build();
}
*/
/*public AuthResponse authenticate(AuthRequest request) {
        // Find user by Email or Phone
        var user = userRepository.findByIdentifier(request.getIdentifier())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Authenticate using the username associated with that account
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        request.getPassword()
                )
        );

        var jwt = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwt).build();
    }
        }
*/

