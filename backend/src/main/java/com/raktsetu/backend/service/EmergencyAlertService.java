package com.raktsetu.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.AlertResponseDTO;
import com.raktsetu.backend.dto.DonationRequestDTO;
import com.raktsetu.backend.entity.BloodRequest;
import com.raktsetu.backend.entity.Donor;
import com.raktsetu.backend.entity.EmergencyAlert;
import com.raktsetu.backend.entity.Notification;
import com.raktsetu.backend.entity.User;
import com.raktsetu.backend.enums.AlertResponse;
import com.raktsetu.backend.enums.Availability;
import com.raktsetu.backend.enums.NotificationType;
import com.raktsetu.backend.enums.RequestStatus;
import com.raktsetu.backend.enums.VerificationStatus;
import com.raktsetu.backend.repository.DonorRepository;
import com.raktsetu.backend.repository.EmergencyAlertRepository;
import com.raktsetu.backend.repository.NotificationRepository;
import com.raktsetu.backend.repository.UserRepository;
import com.raktsetu.backend.exception.BadRequestException;
import com.raktsetu.backend.exception.ResourceNotFoundException;

@Service
public class EmergencyAlertService {

    private final EmergencyAlertRepository alertRepository;
    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final DonationService donationService;

    // Standard single-donation volume used when a donor accepts an alert and we
    // auto-log the donation on their behalf (whole-blood bag, ml).
    private static final int DEFAULT_DONATION_QUANTITY_ML = 450;
    private static final int DEFAULT_UNITS_DONATED = 1;

    // Same donor cooldown window used by DonorMatchingService's eligibility query.
    // Checked directly (not just via the donor's isAvailable flag) so a donor
    // can't bypass cooldown by manually toggling availability back on and then
    // accepting a stale pending alert.
    private static final int DONOR_COOLDOWN_DAYS = 90;

    public EmergencyAlertService(EmergencyAlertRepository alertRepository,
                                 DonorRepository donorRepository,
                                 UserRepository userRepository,
                                 NotificationRepository notificationRepository,
                                 DonationService donationService) {
        this.alertRepository = alertRepository;
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.donationService = donationService;
    }

    // Donor accepts or rejects an alert from their dashboard
    public AlertResponseDTO respondToAlert(String donorEmail, Long alertId, AlertResponse response) {

        User user = userRepository.findByEmail(donorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Donor donor = donorRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));

        EmergencyAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

        if (!alert.getDonor().getDonorId().equals(donor.getDonorId())) {
            throw new BadRequestException("This alert does not belong to you");
        }

        if (alert.getResponse() != AlertResponse.PENDING) {
            throw new BadRequestException("You have already responded to this alert");
        }

        if (response == AlertResponse.ACCEPTED) {

            if (donor.getUser().getIsVerified() != VerificationStatus.Accepted) {
                throw new BadRequestException("Your account is not verified yet. Please wait for admin approval before accepting donation requests.");
            }

            // A donor who has already donated recently (cooldown) or is otherwise
            // marked unavailable should not be able to accept a second request.
            if (donor.getIsAvailable() != Availability.Yes) {
                throw new BadRequestException("You are currently unavailable to donate (recent donation cooldown). Please wait before accepting new requests.");
            }

            if (donor.getLastDonationDate() != null
                    && donor.getLastDonationDate().isAfter(LocalDate.now().minusDays(DONOR_COOLDOWN_DAYS))) {
                throw new BadRequestException("You are still in your " + DONOR_COOLDOWN_DAYS + "-day donation cooldown period and cannot accept new requests yet.");
            }
        }

        alert.setResponse(response);
        alert.setRespondedAt(LocalDateTime.now());

        EmergencyAlert saved = alertRepository.save(alert);

        if (response == AlertResponse.ACCEPTED) {
            recordDonationIfRequestStillOpen(saved, donor);
            // Donor just committed to one donation — they can't fulfil any other
            // pending alerts, so auto-reject the rest on their behalf.
            autoRejectOtherPendingAlerts(saved, donor);
        }

        notifyPatient(saved, donor, response);

        return mapToDTO(saved);
    }

    // Once a donor accepts one alert, every other PENDING alert they were sent
    // (for other blood requests) is auto-rejected — a donor can only fulfil one
    // request per donation, and they're now in cooldown per DonationService.
    private void autoRejectOtherPendingAlerts(EmergencyAlert acceptedAlert, Donor donor) {

        List<EmergencyAlert> otherPending =
                alertRepository.findByDonor_DonorIdAndResponse(donor.getDonorId(), AlertResponse.PENDING);

        for (EmergencyAlert other : otherPending) {

            if (other.getAlertId().equals(acceptedAlert.getAlertId())) {
                continue;
            }

            other.setResponse(AlertResponse.REJECTED);
            other.setRespondedAt(LocalDateTime.now());
            alertRepository.save(other);

            notifyPatient(other, donor, AlertResponse.REJECTED);
        }
    }

    // On acceptance the documented flow says: donation recorded, blood_stock updated,
    // donor cooldown started, patient notified. DonationService.addDonation already
    // handles all of that in one place, so we just call it here instead of leaving it
    // as a separate manual step. Guarded by request status so that if several donors
    // are alerted and more than one accepts, only the first acceptance creates a
    // donation/fulfills the request — later acceptances are recorded as responses but
    // don't double-fulfill an already-FULFILLED request.
    private void recordDonationIfRequestStillOpen(EmergencyAlert alert, Donor donor) {

        BloodRequest request = alert.getRequest();

        if (request.getStatus() != RequestStatus.PENDING) {
            return;
        }

        DonationRequestDTO donationRequest = new DonationRequestDTO();
        donationRequest.setDonorId(donor.getDonorId());
        donationRequest.setRequestId(request.getRequestId());
        donationRequest.setUnitsDonated(DEFAULT_UNITS_DONATED);
        donationRequest.setQuantityMl(DEFAULT_DONATION_QUANTITY_ML);
        donationRequest.setDonationDate(LocalDateTime.now().toLocalDate().toString());

        donationService.addDonation(donationRequest);
    }

    // Notify the patient who raised the request about the donor's response
    private void notifyPatient(EmergencyAlert alert, Donor donor, AlertResponse response) {

        BloodRequest request = alert.getRequest();
        User patientUser = request.getPatient().getUser();

        String message = (response == AlertResponse.ACCEPTED)
                ? "Donor " + donor.getUser().getName() + " has accepted your blood request."
                : "Donor " + donor.getUser().getName() + " is unavailable for your blood request right now.";

        Notification notification = new Notification();
        notification.setUser(patientUser);
        notification.setMessage(message);
        notification.setType(NotificationType.ALERT);

        notificationRepository.save(notification);
    }

    // Alerts received by a specific donor (donor's own alert history)
    public List<AlertResponseDTO> getAlertsByDonor(Long donorId) {
        return alertRepository.findByDonor_DonorId(donorId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // JWT se logged-in donor ki apni alert history dekhna
    public List<AlertResponseDTO> getMyAlerts(String donorEmail) {

        User user = userRepository.findByEmail(donorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Donor donor = donorRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));

        return getAlertsByDonor(donor.getDonorId());
    }

    // All alerts sent out for a given blood request (Admin view)
    public List<AlertResponseDTO> getAlertsByRequest(Long requestId) {
        return alertRepository.findByRequest_RequestId(requestId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private AlertResponseDTO mapToDTO(EmergencyAlert alert) {

        AlertResponseDTO dto = new AlertResponseDTO();

        dto.setAlertId(alert.getAlertId());
        dto.setRequestId(alert.getRequest().getRequestId());
        dto.setDonorId(alert.getDonor().getDonorId());
        dto.setDonorName(alert.getDonor().getUser().getName());
        dto.setSentAt(alert.getSentAt());
        dto.setResponse(alert.getResponse().name());
        dto.setRespondedAt(alert.getRespondedAt());

        return dto;
    }
}
