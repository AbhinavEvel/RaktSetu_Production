package com.raktsetu.backend.service.PatientInterface;


import java.util.List;

import com.raktsetu.backend.dto.PatientRequestDTO;
import com.raktsetu.backend.dto.PatientResponseDTO;

public interface PatientService {
	PatientResponseDTO createPatientProfile(String email, PatientRequestDTO requestDTO);

	PatientResponseDTO getPatientProfile(String email);

	PatientResponseDTO updatePatientProfile(String email, PatientRequestDTO requestDTO);
    List<PatientResponseDTO> getAllPatients();
}
