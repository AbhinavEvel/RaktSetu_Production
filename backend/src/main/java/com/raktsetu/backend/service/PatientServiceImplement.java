package com.raktsetu.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.PatientRequestDTO;
import com.raktsetu.backend.dto.PatientResponseDTO;
import com.raktsetu.backend.entity.Patient;
import com.raktsetu.backend.entity.User;
import com.raktsetu.backend.repository.PatientRepository;
import com.raktsetu.backend.repository.UserRepository;
import com.raktsetu.backend.service.PatientInterface.PatientService;

import java.util.List;
import java.util.stream.Collectors;
import com.raktsetu.backend.exception.ResourceNotFoundException;
import com.raktsetu.backend.exception.BadRequestException;

@Service
@RequiredArgsConstructor
public class PatientServiceImplement implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Override
    public PatientResponseDTO createPatientProfile(String email, PatientRequestDTO requestDTO) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (patientRepository.findByUser_UserId(user.getUserId()).isPresent()) {
            throw new BadRequestException("Patient profile already exists for this user");
        }

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setBloodGroupNeeded(requestDTO.getBloodGroupNeeded());
        patient.setAge(requestDTO.getAge());
        patient.setCity(requestDTO.getCity());
        patient.setState(requestDTO.getState());
        patient.setAddress(requestDTO.getAddress());

        Patient saved = patientRepository.save(patient);

        return mapToDTO(saved);
    }

    @Override
    public PatientResponseDTO getPatientProfile(String email) {

        System.out.println("===========");
        System.out.println("EMAIL = " + email);
        System.out.println("===========");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Patient patient = patientRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return mapToDTO(patient);
    }

    @Override
    public PatientResponseDTO updatePatientProfile(String email, PatientRequestDTO requestDTO) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Patient patient = patientRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        patient.setBloodGroupNeeded(requestDTO.getBloodGroupNeeded());
        patient.setAge(requestDTO.getAge());
        patient.setCity(requestDTO.getCity());
        patient.setState(requestDTO.getState());
        patient.setAddress(requestDTO.getAddress());

        Patient updated = patientRepository.save(patient);

        return mapToDTO(updated);
    }

    @Override
    public List<PatientResponseDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PatientResponseDTO mapToDTO(Patient patient) {
        return PatientResponseDTO.builder()
                .patientId(patient.getPatientId())
                .name(patient.getUser().getName())
                .email(patient.getUser().getEmail())
                .phone(patient.getUser().getPhone())
                .bloodGroupNeeded(patient.getBloodGroupNeeded())
                .age(patient.getAge())
                .city(patient.getCity())
                .state(patient.getState())
                .address(patient.getAddress())
                .build();
    }
}
