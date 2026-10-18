package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.BloodGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDTO {
    private Long patientId;
    private String name;       // User table se aayega
    private String email;      // User table se aayega
    private String phone;      // User table se aayega
    private BloodGroup bloodGroupNeeded;
    private Integer age;
    private String city;
    private String state;
    private String address;
}
