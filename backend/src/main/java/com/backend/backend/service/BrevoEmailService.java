package com.backend.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {

    @Value("${brevo.api.key:${app.brevo.api-key:YOUR_BREVO_API_KEY}}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:${app.brevo.sender-email:seabuhikhazimzade@gmail.com}}")
    private String senderEmail;

    @Value("${brevo.sender.name:${app.brevo.sender-name:Savelya}}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendOtpEmail(String recipientEmail, String recipientName, String otpCode) {
        String brevoUrl = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        Map<String, Object> body = new HashMap<>();
        
        Map<String, String> sender = new HashMap<>();
        sender.put("name", senderName);
        sender.put("email", senderEmail);
        body.put("sender", sender);

        Map<String, String> toUser = new HashMap<>();
        toUser.put("email", recipientEmail);
        toUser.put("name", recipientName);
        body.put("to", List.of(toUser));

        body.put("subject", "Your LinguaPro OTP Verification Code: " + otpCode);
        
        String htmlBody = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #020617; color: #ffffff; border-radius: 12px; max-width: 500px; margin: 0 auto;'>"
                + "<h2 style='color: #ffffff; margin-bottom: 10px;'>LinguaPro Email Verification</h2>"
                + "<p style='color: #cbd5e1; font-size: 14px;'>Hello " + recipientName + ",</p>"
                + "<p style='color: #cbd5e1; font-size: 14px;'>Thank you for registering on LinguaPro. Please use the following 6-digit OTP code to verify your account:</p>"
                + "<div style='background-color: #0f172a; border: 1px solid #1e293b; text-align: center; padding: 15px; border-radius: 10px; margin: 20px 0;'>"
                + "<span style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff;'>" + otpCode + "</span>"
                + "</div>"
                + "<p style='color: #94a3b8; font-size: 12px;'>This OTP code will expire in 15 minutes. If you did not request this, please ignore this email.</p>"
                + "</div>";

        body.put("htmlContent", htmlBody);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(brevoUrl, HttpMethod.POST, request, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            System.err.println("Failed to send email via Brevo API: " + e.getMessage());
            System.out.println(">>> [DEVELOPMENT OTP BACKUP CODE]: " + otpCode + " for " + recipientEmail);
            return false;
        }
    }
}
