package com.raktsetu.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import com.raktsetu.backend.entity.Donor;
import com.raktsetu.backend.enums.Availability;
import com.raktsetu.backend.enums.BloodGroup;


@Repository
public interface DonorRepository extends JpaRepository<Donor, Long>{
	Optional<Donor> findByUser_UserId(Long userId);
	 @Query("SELECT d FROM Donor d WHERE " +
	           "d.bloodGroup = :bloodGroup " +
	           "AND LOWER(TRIM(d.city)) = LOWER(TRIM(:city)) " +
	           "AND d.isAvailable = :availability " +
	           "AND d.user.isVerified = com.raktsetu.backend.enums.VerificationStatus.Accepted " +
	           "AND (d.lastDonationDate IS NULL OR d.lastDonationDate <= :cutoffDate)")
	    List<Donor> findEligibleDonors(
	            @Param("bloodGroup") BloodGroup bloodGroup,
	            @Param("city") String city,
	            @Param("availability") Availability availability,
	            @Param("cutoffDate") LocalDate cutoffDate
	    );
}
