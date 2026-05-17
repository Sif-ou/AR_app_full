package com.example.demo.User;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class EmailVerificationService {

    @Value("${brevo.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public void sendVerificationEmail(String recipientEmail, String verificationCode) {
        String url = "https://api.brevo.com/v3/smtp/email";

        // Building the clean text body with your 6-digit verification code
        String textContent = """
                Hello,
                
                Thank you for registering. Please use the following 6-digit confirmation code to verify your account:
                
                👉 %s
                
                This code will expire after 15 min. If you did not request this, please ignore this email.
                
                Best regards,
                Your ChatBot Robert
                """.formatted(verificationCode);

        // Building the precise payload Brevo's API requires
        Map<String, Object> requestBody = Map.of(
            "sender", Map.of("name", "Ecommerce Store", "email", "xdgenshin012@gmail.com"),
            "to", List.of(Map.of("email", recipientEmail)),
            "subject", " Verify Your Account - Ecommerce Store ",
            "textContent", textContent
        );

        try {
            // Sending over Port 443 (Standard web traffic - Render won't block this!)
            restClient.post()
                    .uri(url)
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .toBodilessEntity();
            
            System.out.println("Verification email sent successfully via Brevo API to " + recipientEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email via Brevo API: " + e.getMessage());
        }
    }
}