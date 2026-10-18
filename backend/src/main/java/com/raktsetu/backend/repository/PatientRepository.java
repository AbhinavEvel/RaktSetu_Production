package com.raktsetu.backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raktsetu.backend.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient,Long> {
	Optional<Patient> findByUser_UserId(Long userId);

}
