package com.example.demo.User;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class EmailVerificationService {

    private final RestClient restClient;

    // This reads your existing PASSWORD_EMAIL_CODE variable from Render
    @Value("${PASSWORD_EMAIL_CODE}")
    private String brevoApiKey;

    public EmailVerificationService(RestClient restClient) {
        this.restClient = restClient;
    }

    public void sendVerificationEmail(String recipientEmail, String verificationCode) {
        String url = "https://api.brevo.com/v3/smtp/email";

        // Build the JSON payload required by Brevo's API
        Map<String, Object> requestBody = Map.of(
            "sender", Map.of("name", "Ecommerce Store", "email", "xdgenshin012@gmail.com"),
            "to", List.of(Map.of("email", recipientEmail)),
            "subject", "Verify Your Account - Ecommerce Store",
            "htmlContent", "<h3>Hello,</h3><p>Thank you for registering. Please use the following 6-digit confirmation code to verify your account:</p>"
                    + "<h2 style='color:#2563eb;'>" + verificationCode + "</h2>"
                    + "<p>This code will expire after 15 minutes.</p><p>Best regards,<br>Your ChatBot Robert</p>"
        );

        try {
            restClient.post()
                    .uri(url)
                    .header("api-key", brevoApiKey) // Send API key via header
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .toBodilessEntity();

            System.out.println("Verification email successfully sent via HTTPS API to " + recipientEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email via HTTP API: " + e.getMessage());
        }
    }
}