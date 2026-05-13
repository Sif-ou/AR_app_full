package com.example.demo.Security;

import com.example.demo.Security.AuthService;

import com.example.demo.Security.AuthResponse;
import com.example.demo.Security.AuthRequest;

import com.example.demo.Security.RegisterRequest;



import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService ;

public AuthController(AuthService authService) {
    this.authService = authService;
}

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Register new user and return JWT
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        // Authenticate and return JWT
        return ResponseEntity.ok(authService.authenticate(request));
    }
}