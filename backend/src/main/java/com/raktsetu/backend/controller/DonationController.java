package com.raktsetu.backend.controller;

import java.util.List;
import org.springframework.security.core.Authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raktsetu.backend.dto.DonationRequestDTO;
import com.raktsetu.backend.dto.DonationResponseDTO;
import com.raktsetu.backend.service.DonationService;

@RestController
@RequestMapping("/api/donations")

public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    // Add Donation
    @PostMapping
    public ResponseEntity<DonationResponseDTO> addDonation(
            @RequestBody DonationRequestDTO dto) {

        DonationResponseDTO response = donationService.addDonation(dto);

        return ResponseEntity.ok(response);
    }

    // Get All Donations
    @GetMapping
    public ResponseEntity<List<DonationResponseDTO>> getAllDonations() {

        return ResponseEntity.ok(donationService.getAllDonations());
    }

    // Get Donation By Id
    @GetMapping("/{id}")
    public ResponseEntity<DonationResponseDTO> getDonationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    // Get Donations By Donor
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationResponseDTO>> getDonationsByDonor(
            @PathVariable Long donorId) {

        return ResponseEntity.ok(donationService.getDonationsByDonor(donorId));
    }

    // Get Donations By Blood Request
    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<DonationResponseDTO>> getDonationsByRequest(
            @PathVariable Long requestId) {

        return ResponseEntity.ok(donationService.getDonationsByRequest(requestId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<DonationResponseDTO>> getMyDonations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(donationService.getMyDonations(email));
    }

}
