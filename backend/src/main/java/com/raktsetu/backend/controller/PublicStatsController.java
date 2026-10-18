package com.raktsetu.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raktsetu.backend.dto.PublicStatsDTO;
import com.raktsetu.backend.enums.DonationStatus;
import com.raktsetu.backend.enums.RequestStatus;
import com.raktsetu.backend.repository.BloodRequestRepository;
import com.raktsetu.backend.repository.DonationRepository;
import com.raktsetu.backend.repository.DonorRepository;

// Public, unauthenticated endpoints — used by the landing page before login.
@RestController
@RequestMapping("/api/public")
public class PublicStatsController {

    private final DonorRepository donorRepository;
    private final DonationRepository donationRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public PublicStatsController(DonorRepository donorRepository,
                                  DonationRepository donationRepository,
                                  BloodRequestRepository bloodRequestRepository) {
        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<PublicStatsDTO> getPublicStats() {
        long registeredDonors = donorRepository.count();
        long livesSaved = donationRepository.countByStatus(DonationStatus.COMPLETED);
        long requestsFulfilled = bloodRequestRepository.countByStatus(RequestStatus.FULFILLED);

        return ResponseEntity.ok(new PublicStatsDTO(registeredDonors, livesSaved, requestsFulfilled));
    }
}
