package com.example.demo.User; // Adjust package to your auth location

import com.example.demo.User.VerifyCodeRequest;
import com.example.demo.User.User;
import com.example.demo.User.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth") // Or whatever your auth prefix is
public class AuthControllerEmail {

    private final UserRepository userRepository;
    private final EmailVerificationService emailService;

    // Injecting your existing repo and the new email service
    public AuthControllerEmail(UserRepository userRepository, EmailVerificationService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyCodeRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User registration not found.");
        }

        // 1. Validate code
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect verification code.");
        }

        // 2. Validate expiration
        if (LocalDateTime.now().isAfter(user.getVerificationExpiry())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Verification code has expired.");
        }

        // 3. Activate and clean up database fields
        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Account successfully activated! You can now log in.");
    }
}