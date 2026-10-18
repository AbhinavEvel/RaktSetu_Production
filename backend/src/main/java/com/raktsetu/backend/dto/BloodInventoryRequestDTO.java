package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.BloodGroup;
import com.raktsetu.backend.enums.Component;

import lombok.Data;

@Data
public class BloodInventoryRequestDTO {
    private String bagNumber;
    private BloodGroup bloodGroup;
    private Component component;
    private Integer quantityMl;
    private String receivedDate;
}
