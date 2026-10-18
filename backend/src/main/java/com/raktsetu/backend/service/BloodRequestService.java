package com.raktsetu.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.BloodRequestDTO;
import com.raktsetu.backend.dto.BloodRequestResponseDTO;
import com.raktsetu.backend.entity.BloodRequest;
import com.raktsetu.backend.entity.Patient;
import com.raktsetu.backend.enums.BloodGroup;
import com.raktsetu.backend.enums.Component;
import com.raktsetu.backend.enums.RequestStatus;
import com.raktsetu.backend.enums.Urgency;
import com.raktsetu.backend.enums.VerificationStatus;
import com.raktsetu.backend.repository.BloodRequestRepository;
import com.raktsetu.backend.repository.PatientRepository;
import com.raktsetu.backend.exception.BadRequestException;
import com.raktsetu.backend.exception.ResourceNotFoundException;


@Service
public class BloodRequestService {

    private final BloodRequestRepository requestRepository;
    private final PatientRepository patientRepository;
    private final BloodStockService bloodStockService;
    private final DonorMatchingService donorMatchingService;

    public BloodRequestService(BloodRequestRepository requestRepository,
                               PatientRepository patientRepository,
                               BloodStockService bloodStockService,DonorMatchingService donorMatchingService) {
        this.requestRepository = requestRepository;
        this.patientRepository = patientRepository;
        this.bloodStockService = bloodStockService;
        this.donorMatchingService = donorMatchingService;
    }

    public BloodRequestResponseDTO createRequest(Long userId, BloodRequestDTO dto) {

        Patient patient = patientRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        if (patient.getUser().getIsVerified() != VerificationStatus.Accepted) {
            throw new BadRequestException("Your account is not verified yet. Please wait for admin approval before raising a blood request.");
        }

        BloodGroup bg = BloodGroup.fromValue(dto.getBloodGroup());
        Component comp = Component.valueOf(dto.getComponent());

        BloodRequest request = new BloodRequest();
        request.setPatient(patient);
        request.setBloodGroup(bg);
        request.setComponent(comp);
        request.setUnitsNeeded(dto.getUnitsNeeded());
        request.setUrgency(Urgency.valueOf(dto.getUrgency()));
        request.setContactNumber(dto.getContactNumber());
        request.setLocationDetails(dto.getLocationDetails());
        request.setAdditionalNote(dto.getAdditionalNote());
        request.setStatus(RequestStatus.PENDING);

        BloodRequest saved = requestRepository.save(request);

        boolean available = bloodStockService.isStockAvailable(bg, comp, dto.getUnitsNeeded());

        if (available) {
            bloodStockService.deductStock(bg, comp, dto.getUnitsNeeded());
            saved.setStatus(RequestStatus.FULFILLED);
            saved = requestRepository.save(saved);
        } else {
									donorMatchingService.matchAndAlertDonors(saved);
        }

        return mapToDTO(saved);
    }

    public List<BloodRequestResponseDTO> getPatientRequests(Long patientId, Long requesterUserId, boolean isAdmin) {

        if (!isAdmin) {
            Patient requester = patientRepository.findByUser_UserId(requesterUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

            if (!requester.getPatientId().equals(patientId)) {
                throw new BadRequestException("Access denied: you can only view your own requests");
            }
        }

        return requestRepository.findByPatient_PatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Admin manually re-triggers donor matching (e.g. after a new eligible donor registered/verified)
    public List<com.raktsetu.backend.entity.Donor> rematchDonors(Long requestId) {

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood Request not found"));

        return donorMatchingService.matchAndAlertDonors(request);
    }

    // Patient cancels their OWN request — only allowed while still PENDING
    // (once fulfilled from stock or matched to a donor, cancelling from here
    // could leave stock/alerts in an inconsistent state, so admin handles that)
    public BloodRequestResponseDTO cancelRequest(Long requestId, Long userId) {

        BloodRequest request = getOwnedPendingRequest(requestId, userId);

        request.setStatus(RequestStatus.CANCELLED);
        BloodRequest saved = requestRepository.save(request);

        return mapToDTO(saved);
    }

    // Patient edits their OWN request — only allowed while still PENDING.
    // If the edited request can now be covered by stock, it's fulfilled
    // immediately (same as creation); otherwise donor matching re-runs so
    // newly-eligible donors (e.g. after a blood group/units change) get alerted.
    public BloodRequestResponseDTO editRequest(Long requestId, Long userId, BloodRequestDTO dto) {

        BloodRequest request = getOwnedPendingRequest(requestId, userId);

        BloodGroup bg = BloodGroup.fromValue(dto.getBloodGroup());
        Component comp = Component.valueOf(dto.getComponent());

        request.setBloodGroup(bg);
        request.setComponent(comp);
        request.setUnitsNeeded(dto.getUnitsNeeded());
        request.setUrgency(Urgency.valueOf(dto.getUrgency()));
        request.setContactNumber(dto.getContactNumber());
        request.setLocationDetails(dto.getLocationDetails());
        request.setAdditionalNote(dto.getAdditionalNote());

        BloodRequest saved = requestRepository.save(request);

        boolean available = bloodStockService.isStockAvailable(bg, comp, dto.getUnitsNeeded());

        if (available) {
            bloodStockService.deductStock(bg, comp, dto.getUnitsNeeded());
            saved.setStatus(RequestStatus.FULFILLED);
            saved = requestRepository.save(saved);
        } else {
            donorMatchingService.matchAndAlertDonors(saved);
        }

        return mapToDTO(saved);
    }

    private BloodRequest getOwnedPendingRequest(Long requestId, Long userId) {

        Patient requester = patientRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood Request not found"));

        if (!request.getPatient().getPatientId().equals(requester.getPatientId())) {
            throw new BadRequestException("Access denied: you can only manage your own requests");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be cancelled or edited");
        }

        return request;
    }

    public List<BloodRequestResponseDTO> getAllRequests() {
        return requestRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Admin manually updates a request's status (e.g. cancelling a stuck PENDING request)
    public BloodRequestResponseDTO updateStatus(Long requestId, RequestStatus status) {

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood Request not found"));

        request.setStatus(status);

        BloodRequest saved = requestRepository.save(request);

        return mapToDTO(saved);
    }

    private BloodRequestResponseDTO mapToDTO(BloodRequest request) {

					BloodRequestResponseDTO dto = new BloodRequestResponseDTO();

					dto.setRequestId(request.getRequestId());
					dto.setBloodGroup(request.getBloodGroup().getLabel());
					dto.setComponent(request.getComponent().name());
					dto.setUnitsNeeded(request.getUnitsNeeded());
					dto.setUrgency(request.getUrgency().name());
					dto.setContactNumber(request.getContactNumber());
					dto.setLocationDetails(request.getLocationDetails());
					dto.setAdditionalNote(request.getAdditionalNote());
					dto.setStatus(request.getStatus().name());
					dto.setCreatedAt(request.getCreatedAt() != null ? request.getCreatedAt().toString() : null);

					return dto;

    }


}
