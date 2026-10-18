package com.raktsetu.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    private final JavaMailSender mailSender;


    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    public void sendAlertEmail(String to, String subject, String body) {

        try {
            SimpleMailMessage mail = new SimpleMailMessage();

            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);

            mailSender.send(mail);
        } catch (Exception e) {
            // Mail server issues (bad credentials, network/timeout, etc.) should never
            // block the caller's flow (e.g. blood request creation, donor alerting).
            // Log and move on instead of letting the exception bubble up.
            System.err.println("Failed to send alert email to " + to + ": " + e.getMessage());
        }
    }
}
