package com.raktsetu.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.raktsetu.backend.entity.Donation;
import com.raktsetu.backend.enums.DonationStatus;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long>{

    List<Donation> findByDonorDonorId(Long donorId);

    List<Donation> findByBloodRequestRequestId(Long requestId);

    long countByStatus(DonationStatus status);

}
