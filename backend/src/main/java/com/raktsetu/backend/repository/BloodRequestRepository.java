package com.raktsetu.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.raktsetu.backend.entity.BloodRequest;
import com.raktsetu.backend.enums.RequestStatus;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByPatient_PatientId(Long patientId);
    long countByStatus(RequestStatus status);
}
