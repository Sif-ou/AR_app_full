package com.example.demo.Security;

import com.example.demo.Security.AuthRequest;
import com.example.demo.Security.AuthResponse;
import com.example.demo.Security.RegisterRequest;

import com.example.demo.User.User;
import com.example.demo.User.UserRepository;
import com.example.demo.Security.JwtService;


import lombok.RequiredArgsConstructor;
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


    public AuthService ( UserRepository userRepository ,  PasswordEncoder passwordEncoder , JwtService jwtService , AuthenticationManager authenticationManager ) 
    {
        this.userRepository = userRepository ;
        this.passwordEncoder = passwordEncoder ;
        this.jwtService = jwtService ;
        this.authenticationManager = authenticationManager ;
    }


public AuthResponse register(RegisterRequest request) {
    var user = User.builder()
            .username( request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role_id("CLIENT") 
            .build();

    userRepository.save(user);

    var jwt = jwtService.generateToken(user);

    return AuthResponse.builder()
            .token(jwt)
            .build();
}

    /*public AuthResponse register(RegisterRequest request) {
        // Create new user with encoded password
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role_id()("CLIENT")
                .build();

        // Save to database
        userRepository.save(user);

        // Generate JWT for immediate login after registration
        var jwt = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwt)
                .build();
    }*/

    public AuthResponse authenticate(AuthRequest request) {
        // Let Spring Security validate credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword() 
                )
        );

        // If we get here, credentials are valid
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        // Generate and return JWT
        var jwt = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwt)
                .build();
    }
}