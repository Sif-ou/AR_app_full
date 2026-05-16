package com.example.demo.Security;

import com.example.demo.Role.Role;
import com.example.demo.Role.RoleRepository;

import com.example.demo.User.User;
import com.example.demo.User.UserRepository;



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

    // 3. Authenticate using the username associated with that account
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    request.getPassword()
            )
    );

    // 4. Everything matches! Generate and return your JWT token payload
    var jwt = jwtService.generateToken(user);
    return AuthResponse.builder().token(jwt).build();
}

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
*/

}