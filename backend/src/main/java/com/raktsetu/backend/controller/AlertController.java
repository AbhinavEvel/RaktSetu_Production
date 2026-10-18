package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.raktsetu.backend.dto.AlertRespondRequest;
import com.raktsetu.backend.dto.AlertResponseDTO;
import com.raktsetu.backend.service.EmergencyAlertService;

import jakarta.validation.Valid;
import com.raktsetu.backend.exception.BadRequestException;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final EmergencyAlertService alertService;

    public AlertController(EmergencyAlertService alertService) {
        this.alertService = alertService;
    }

    // Donor accepts / rejects an emergency alert
    @PutMapping("/respond/{alertId}")
    public ResponseEntity<AlertResponseDTO> respond(
            @PathVariable Long alertId,
            @Valid @RequestBody AlertRespondRequest request,
            Authentication authentication) {

        String donorEmail = authentication.getName();
        AlertResponseDTO response = alertService.respondToAlert(donorEmail, alertId, request.getResponse());
        return ResponseEntity.ok(response);
    }

    // Logged-in donor's own alert history
    @GetMapping("/my")
    public ResponseEntity<List<AlertResponseDTO>> getMyAlerts(Authentication authentication) {
        return ResponseEntity.ok(alertService.getMyAlerts(authentication.getName()));
    }

    // Donor's alert history (Admin lookup)
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<AlertResponseDTO>> getByDonor(
            @PathVariable Long donorId,
            Authentication authentication) {

        if (!isAdmin(authentication)) {
            throw new BadRequestException("Access denied: Admins only");
        }
        return ResponseEntity.ok(alertService.getAlertsByDonor(donorId));
    }

    // All alerts sent for a request — Admin only
    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<AlertResponseDTO>> getByRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        if (!isAdmin(authentication)) {
            throw new BadRequestException("Access denied: Admins only");
        }
        return ResponseEntity.ok(alertService.getAlertsByRequest(requestId));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_Admin"));
    }
}
