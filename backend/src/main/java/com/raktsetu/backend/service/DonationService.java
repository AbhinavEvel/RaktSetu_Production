package com.raktsetu.backend.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.raktsetu.backend.dto.DonationRequestDTO;
import com.raktsetu.backend.dto.DonationResponseDTO;
import com.raktsetu.backend.entity.BloodRequest;
import com.raktsetu.backend.entity.Donation;
import com.raktsetu.backend.entity.Donor;
import com.raktsetu.backend.entity.User;
import com.raktsetu.backend.enums.Availability;
import com.raktsetu.backend.enums.DonationStatus;
import com.raktsetu.backend.enums.RequestStatus;
import com.raktsetu.backend.repository.BloodRequestRepository;
import com.raktsetu.backend.repository.DonationRepository;
import com.raktsetu.backend.repository.DonorRepository;
import com.raktsetu.backend.repository.UserRepository; // ✅ EDIT: naya import - "my donations" ke liye email se user dhoondna hai
import com.raktsetu.backend.exception.ResourceNotFoundException;

@Service
public class DonationService {
    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository; // ✅ EDIT: naya field

    public DonationService(DonationRepository donationRepository,
                           DonorRepository donorRepository,
                           BloodRequestRepository bloodRequestRepository,
                           UserRepository userRepository) { // ✅ EDIT: constructor mein add kiya
        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.userRepository = userRepository;
    }

    // Add Donation
    public DonationResponseDTO addDonation(DonationRequestDTO dto) {
        Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found"));
        BloodRequest request = bloodRequestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Blood Request not found"));
        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setBloodRequest(request);
        donation.setUnitsDonated(dto.getUnitsDonated());
        donation.setQuantityMl(dto.getQuantityMl());
        donation.setDonationDate(java.time.LocalDate.parse(dto.getDonationDate()));
        donation.setStatus(DonationStatus.COMPLETED);
        Donation savedDonation = donationRepository.save(donation);

        // Update Blood Request Status
        request.setStatus(RequestStatus.FULFILLED);
        bloodRequestRepository.save(request);

        // ✅ EDIT: Cooldown logic - donor ka lastDonationDate aur availability update karo
        donor.setLastDonationDate(donation.getDonationDate());
        donor.setIsAvailable(Availability.No);
        donorRepository.save(donor);

        return mapToResponse(savedDonation);
    }

    // ✅ NAYA METHOD: JWT se logged-in donor ki apni donations dekhna
    public List<DonationResponseDTO> getMyDonations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Donor donor = donorRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));

        return donationRepository.findByDonorDonorId(donor.getDonorId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get All Donations
    public List<DonationResponseDTO> getAllDonations() {
        return donationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Donation By Id
    public DonationResponseDTO getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        return mapToResponse(donation);
    }

    // Get Donations By Donor
    public List<DonationResponseDTO> getDonationsByDonor(Long donorId) {
        return donationRepository.findByDonorDonorId(donorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Donations By Blood Request
    public List<DonationResponseDTO> getDonationsByRequest(Long requestId) {
        return donationRepository.findByBloodRequestRequestId(requestId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Mapping
    private DonationResponseDTO mapToResponse(Donation donation) {
        DonationResponseDTO dto = new DonationResponseDTO();
        dto.setDonationId(donation.getDonationId());
        dto.setDonorId(donation.getDonor().getDonorId());
        dto.setRequestId(donation.getBloodRequest().getRequestId());
        dto.setUnitsDonated(donation.getUnitsDonated());
        dto.setQuantityMl(donation.getQuantityMl());
        dto.setDonationDate(donation.getDonationDate().toString());
        dto.setStatus(donation.getStatus().name());
        return dto;
    }
}
