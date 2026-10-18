package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raktsetu.backend.dto.AvailabilityUpdateDTO;
import com.raktsetu.backend.dto.DonorRequest;
import com.raktsetu.backend.dto.DonorResponse;
import com.raktsetu.backend.service.DonorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.raktsetu.backend.exception.BadRequestException;

@RestController
@RequestMapping("/api/donor")
@RequiredArgsConstructor
public class DonorController {
	private final DonorService donorService;

	@PostMapping("/profile")
	public ResponseEntity<DonorResponse> createProfile(@Valid @RequestBody DonorRequest request,
			Authentication authentication){
		String email = authentication.getName();
		DonorResponse response = donorService.createDonorProfile(email, request);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/profile")
	public ResponseEntity<DonorResponse> getProfile(Authentication authentication){
		String email = authentication.getName();
		DonorResponse response = donorService.getDonorProfile(email);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/profile")
	public ResponseEntity<DonorResponse> updateProfile(@Valid @RequestBody DonorRequest request,
			Authentication authentication){
		String email = authentication.getName();
		DonorResponse response = donorService.updateDonorProfile(email, request);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// Donor toggles their own availability ON/OFF
	@PutMapping("/availability")
	public ResponseEntity<DonorResponse> updateAvailability(@Valid @RequestBody AvailabilityUpdateDTO request,
			Authentication authentication){
		String email = authentication.getName();
		DonorResponse response = donorService.updateAvailability(email, request);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// Admin — view all registered donors
	@GetMapping("/all")
	public ResponseEntity<List<DonorResponse>> getAllDonors(Authentication authentication){
		boolean isAdmin = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.anyMatch(a -> a.equals("ROLE_Admin"));

		if (!isAdmin) {
			throw new BadRequestException("Access denied: Admins only");
		}

		return new ResponseEntity<>(donorService.getAllDonors(), HttpStatus.OK);
	}
}
