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