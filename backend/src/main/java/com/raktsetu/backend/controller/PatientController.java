package com.raktsetu.backend.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.raktsetu.backend.dto.PatientRequestDTO;
import com.raktsetu.backend.dto.PatientResponseDTO;
import com.raktsetu.backend.service.PatientInterface.PatientService;
import com.raktsetu.backend.exception.BadRequestException;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping("/profile")
    public PatientResponseDTO createProfile(Authentication authentication,
                                            @RequestBody PatientRequestDTO requestDTO) {
        return patientService.createPatientProfile(authentication.getName(), requestDTO);
    }

    @GetMapping("/profile")
    public PatientResponseDTO getProfile(Authentication authentication) {
        return patientService.getPatientProfile(authentication.getName());
    }

    @PutMapping("/profile/update")
    public PatientResponseDTO updateProfile(Authentication authentication,
                                            @RequestBody PatientRequestDTO requestDTO) {
        return patientService.updatePatientProfile(authentication.getName(), requestDTO);
    }

    // Admin — view all registered patients
    @GetMapping("/all")
    public List<PatientResponseDTO> getAllPatients(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_Admin"));

        if (!isAdmin) {
            throw new BadRequestException("Access denied: Admins only");
        }

        return patientService.getAllPatients();
    }
}
