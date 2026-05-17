package com.example.demo.User;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {

    private final JavaMailSender mailSender;

    // Injecting the mail sender automatically configured by Spring Boot
    public EmailVerificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String recipientEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        // This must match your verified sender email in Brevo
        message.setFrom("xdgenshin012@gmail.com"); 
        message.setTo(recipientEmail);
        
        // Email content strings
        message.setSubject(" Verify Your Account - Ecommerce Store ");
        message.setText("Hello,\n\n"
                + "Thank you for registering. Please use the following 6-digit confirmation code to verify your account:\n\n"
                + "👉 " + verificationCode + "\n\n"
                + "This code will expire after 15 min . If you did not request this, please ignore this email.\n\n"
                + "Best regards,\n Your ChatBot Robert ");

        try {
            mailSender.send(message);
            System.out.println("Verification email sent successfully to " + recipientEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}