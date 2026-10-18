package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.raktsetu.backend.dto.AlertResponseDTO;
import com.raktsetu.backend.dto.BloodRequestDTO;
import com.raktsetu.backend.dto.BloodRequestResponseDTO;
import com.raktsetu.backend.dto.RequestStatusUpdateDTO;
import com.raktsetu.backend.security.CustomUserDetails;
import com.raktsetu.backend.service.BloodRequestService;
import com.raktsetu.backend.service.EmergencyAlertService;

import jakarta.validation.Valid;
import com.raktsetu.backend.exception.BadRequestException;

@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {

    private final BloodRequestService requestService;
    private final EmergencyAlertService alertService;

    public BloodRequestController(BloodRequestService requestService,
                                  EmergencyAlertService alertService) {
        this.requestService = requestService;
        this.alertService = alertService;
    }

    @PostMapping("/create")
    public ResponseEntity<BloodRequestResponseDTO> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody BloodRequestDTO dto) {

        Long userId = ((CustomUserDetails) userDetails).getUserId();

        BloodRequestResponseDTO response =
                requestService.createRequest(userId, dto);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<BloodRequestResponseDTO>> getByPatient(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            Authentication authentication) {

        Long userId = ((CustomUserDetails) userDetails).getUserId();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_Admin"));

        return ResponseEntity.ok(requestService.getPatientRequests(id, userId, isAdmin));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BloodRequestResponseDTO>> getAll(Authentication authentication) {

        requireAdmin(authentication);
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    // Patient — cancel their OWN request (only while PENDING)
    @PutMapping("/cancel/{id}")
    public ResponseEntity<BloodRequestResponseDTO> cancelOwnRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getUserId();
        return ResponseEntity.ok(requestService.cancelRequest(id, userId));
    }

    // Patient — edit their OWN request (only while PENDING)
    @PutMapping("/edit/{id}")
    public ResponseEntity<BloodRequestResponseDTO> editOwnRequest(
            @PathVariable Long id,
            @RequestBody BloodRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getUserId();
        return ResponseEntity.ok(requestService.editRequest(id, userId, dto));
    }

    // Admin manually updates a request's status
    @PutMapping("/status/{id}")
    public ResponseEntity<BloodRequestResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody RequestStatusUpdateDTO dto,
            Authentication authentication) {

        requireAdmin(authentication);
        return ResponseEntity.ok(requestService.updateStatus(id, dto.getStatus()));
    }

    // Admin — which donors were matched (alerted) for this request
    @GetMapping("/match/{requestId}")
    public ResponseEntity<List<AlertResponseDTO>> getMatchedDonors(
            @PathVariable Long requestId,
            Authentication authentication) {

        requireAdmin(authentication);
        return ResponseEntity.ok(alertService.getAlertsByRequest(requestId));
    }

    // Admin — manually re-run donor matching for a stuck PENDING request
    // (e.g. a new eligible donor registered/verified after the request was created)
    @PostMapping("/rematch/{requestId}")
    public ResponseEntity<List<AlertResponseDTO>> rematchDonors(
            @PathVariable Long requestId,
            Authentication authentication) {

        requireAdmin(authentication);
        requestService.rematchDonors(requestId);
        return ResponseEntity.ok(alertService.getAlertsByRequest(requestId));
    }

    private void requireAdmin(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_Admin"));

        if (!isAdmin) {
            throw new BadRequestException("Access denied: Admins only");
        }
    }
}
