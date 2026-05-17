package com.example.demo.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthControllerEmail {

    private final UserRepository userRepository;
    private final EmailVerificationService emailService;

    public AuthControllerEmail(UserRepository userRepository, EmailVerificationService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyCodeRequest request) {
        // 1. Safely retrieve user without throwing a hard runtime crash exception
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User registration not found for the provided email.");
        }

        // 2. Validate activation code
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Incorrect verification code.");
        }

        // 3. Validate code lifetime expiration
        if (LocalDateTime.now().isAfter(user.getVerificationExpiry())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Verification code has expired.");
        }

        // 4. Activate user status and wipe tracking parameters clear
        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Account successfully activated! You can now log in.");
    }
}