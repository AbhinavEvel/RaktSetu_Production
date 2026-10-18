package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.BloodGroup;


import lombok.Data;

@Data
public class PatientRequestDTO {
    private BloodGroup bloodGroupNeeded;
    private Integer age;
    private String city;
    private String state;
    private String address;
}
