package com.raktsetu.backend.service;


import java.time.LocalDate;
import java.util.List;


import org.springframework.stereotype.Service;


import com.raktsetu.backend.entity.BloodRequest;
import com.raktsetu.backend.entity.Donor;
import com.raktsetu.backend.entity.EmergencyAlert;
import com.raktsetu.backend.entity.Notification;

import com.raktsetu.backend.enums.Availability;
import com.raktsetu.backend.enums.NotificationType;

import com.raktsetu.backend.repository.DonorRepository;
import com.raktsetu.backend.repository.EmergencyAlertRepository;
import com.raktsetu.backend.repository.NotificationRepository;



@Service
public class DonorMatchingService {


    private final DonorRepository donorRepository;

    private final EmergencyAlertRepository alertRepository;

    private final NotificationRepository notificationRepository;

    private final EmailService emailService;



    public DonorMatchingService(
            DonorRepository donorRepository,
            EmergencyAlertRepository alertRepository,
            NotificationRepository notificationRepository,
            EmailService emailService) {


        this.donorRepository = donorRepository;

        this.alertRepository = alertRepository;

        this.notificationRepository = notificationRepository;

        this.emailService = emailService;

    }





    public List<Donor> matchAndAlertDonors(
            BloodRequest request) {



        LocalDate cutoffDate =
                LocalDate.now().minusDays(90);



        List<Donor> eligibleDonors =
                donorRepository.findEligibleDonors(
                        request.getBloodGroup(),
                        request.getPatient().getCity(),
                        Availability.Yes,
                        cutoffDate
                );

        // Don't re-alert donors who were already notified for this exact request
        List<Long> alreadyAlertedDonorIds =
                alertRepository.findByRequest_RequestId(request.getRequestId())
                        .stream()
                        .map(a -> a.getDonor().getDonorId())
                        .toList();

        eligibleDonors = eligibleDonors.stream()
                .filter(d -> !alreadyAlertedDonorIds.contains(d.getDonorId()))
                .toList();





        for(Donor donor : eligibleDonors) {



            // 1. Save Emergency Alert


            EmergencyAlert alert =
                    new EmergencyAlert();


            alert.setRequest(request);

            alert.setDonor(donor);


            alertRepository.save(alert);







            // 2. Save Notification


            Notification notification =
                    new Notification();



            notification.setUser(
                    donor.getUser()
            );


            notification.setMessage(
                    "Urgent Blood Requirement : "
                    + request.getBloodGroup()
                    + " at "
                    + request.getLocationDetails()
            );


            notification.setType(
                    NotificationType.ALERT
            );


            notificationRepository.save(notification);








            // 3. Send Email


            String email =
                    donor.getUser().getEmail();



            String body =
                    "Hello Donor,\n\n"
                    +"Urgent blood requirement received.\n\n"
                    +"Blood Group : "
                    +request.getBloodGroup()
                    +"\nComponent : "
                    +request.getComponent()
                    +"\nUnits : "
                    +request.getUnitsNeeded()
                    +"\nLocation : "
                    +request.getLocationDetails()
                    +"\n\nPlease respond if you are available."
                    ;



            emailService.sendAlertEmail(
                    email,
                    "Emergency Blood Requirement",
                    body
            );


        }



        return eligibleDonors;

    }


}
