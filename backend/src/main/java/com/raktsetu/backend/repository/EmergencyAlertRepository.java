package com.raktsetu.backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.raktsetu.backend.entity.EmergencyAlert;
import com.raktsetu.backend.enums.AlertResponse;

@Repository
public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {

    List<EmergencyAlert> findByDonor_DonorId(Long donorId);

    List<EmergencyAlert> findByRequest_RequestId(Long requestId);

    List<EmergencyAlert> findByDonor_DonorIdAndResponse(Long donorId, AlertResponse response);
}
