package com.example.demo.User;

import com.example.demo.Security.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") 
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails.getUsername();

        // Safe lookup strategy across columns
        User user = userRepository.findByUsername(identifier)
                .orElseGet(() -> userRepository.findByEmail(identifier)
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
                }));

        if (user == null) {
            throw new RuntimeException("Profile not found for identifier: " + identifier);
        }

        // Return only the essential identification properties to the frontend application
        AuthResponse profileData = AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getRoleName())
                .build();

        return ResponseEntity.ok(profileData);
    }
}