package com.raktsetu.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.AvailabilityUpdateDTO;
import com.raktsetu.backend.dto.DonorRequest;
import com.raktsetu.backend.dto.DonorResponse;
import com.raktsetu.backend.entity.Donor;
import com.raktsetu.backend.entity.User;
import com.raktsetu.backend.repository.DonorRepository;
import com.raktsetu.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import com.raktsetu.backend.exception.BadRequestException;
import com.raktsetu.backend.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class DonorService {
	private final DonorRepository donorRepository;
	private final UserRepository userRepository;

	public DonorResponse createDonorProfile(String email, DonorRequest request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		if(donorRepository.findByUser_UserId(user.getUserId()).isPresent()) {
			throw new BadRequestException("Donor profile already exists for this user");
		}

		Donor donor = new Donor();
		donor.setUser(user);
		donor.setBloodGroup(request.getBloodGroup());
		donor.setAge(request.getAge());
		donor.setCity(request.getCity());
		donor.setState(request.getState());
		donor.setAddress(request.getAddress());

		if(request.getIsAvailable() != null) {
			donor.setIsAvailable(request.getIsAvailable());
		}

		Donor savedDonor = donorRepository.save(donor);

		return mapToResponse(savedDonor);
	}

	private DonorResponse mapToResponse(Donor donor) {
		return new DonorResponse(
                donor.getDonorId(),
                donor.getUser().getName(),
                donor.getUser().getEmail(),
                donor.getBloodGroup(),
                donor.getAge(),
                donor.getCity(),
                donor.getState(),
                donor.getAddress(),
                donor.getIsAvailable().name(),
                donor.getLastDonationDate()
        );
	}

	public DonorResponse getDonorProfile(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		Donor donor = donorRepository.findByUser_UserId(user.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));
		return mapToResponse(donor);
	}

	public DonorResponse updateDonorProfile(String email, DonorRequest request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		Donor donor = donorRepository.findByUser_UserId(user.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Donot profile not found"));

		donor.setBloodGroup(request.getBloodGroup());
		donor.setAge(request.getAge());
		donor.setCity(request.getCity());
		donor.setState(request.getState());
		donor.setAddress(request.getAddress());

		if(request.getIsAvailable() != null) {
			donor.setIsAvailable(request.getIsAvailable());
		}

		Donor updatedDonor = donorRepository.save(donor);

		return mapToResponse(updatedDonor);
	}

	// Donor toggles their own availability ON/OFF
	public DonorResponse updateAvailability(String email, AvailabilityUpdateDTO request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		Donor donor = donorRepository.findByUser_UserId(user.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));

		donor.setIsAvailable(request.getIsAvailable());

		Donor updatedDonor = donorRepository.save(donor);

		return mapToResponse(updatedDonor);
	}

	// Admin — view all registered donors
	public List<DonorResponse> getAllDonors() {
		return donorRepository.findAll()
				.stream()
				.map(this::mapToResponse)
				.toList();
	}
}
