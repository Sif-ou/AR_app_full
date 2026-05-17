package com.example.demo.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows your frontend to communicate without CORS issues
public class AuthControllerEmail {

    private final UserRepository userRepository;
    private final EmailVerificationService emailService;

    public AuthControllerEmail(UserRepository userRepository, EmailVerificationService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // 1. Route matched to the frontend fetch URL (/api/auth/verify-code)
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyCodeRequest request) {
        
        // 2. Cleaned up user lookup logic
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User registration not found."));
        }

        // 3. Validate code (Returns JSON map object)
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Incorrect verification code."));
        }

        // 4. Validate expiration (Returns JSON map object)
        if (LocalDateTime.now().isAfter(user.getVerificationExpiry())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Verification code has expired."));
        }

        // 5. Activate and clean up database fields
        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Account successfully activated! You can now log in."));
    }



@PostMapping("/resend-code")
    public ResponseEntity<?> resendCode(@RequestBody ResendCodeRequest request) {
        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No registration email found. Please try registering again."));
        }

        // 2. Optional: Check if they are already verified so we don't spam them
        if (user.isActive()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "This account is already verified and active."));
        }

        // 3. Generate a fresh 6-digit random verification code
        String newCode = String.format("%06d", new java.util.Random().nextInt(1000000));

        // 4. Update code and reset expiration window to 15 minutes from now
        user.setVerificationCode(newCode);
        user.setVerificationExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // 5. Fire off the email using your existing service
        try {
            // Adjust this method call name to match whatever method name you defined inside EmailVerificationService
            emailService.sendVerificationEmail(user.getEmail(), newCode);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to dispatch email via SMTP server."));
        }

        // 6. Return exact string wrapper your frontend expects to trigger success message
        return ResponseEntity.ok(Map.of("message", "A new verification code has been dispatched! 🎉"));
    }

}