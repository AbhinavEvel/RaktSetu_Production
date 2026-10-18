package com.raktsetu.backend.dto;

import lombok.Data;

@Data
public class BloodInventoryResponseDTO {
    private Long inventoryId;
    private String bagNumber;
    private String bloodGroup;
    private String componentName;
    private Integer quantityMl;
    private String receivedDate;
    private String expiryDate;
    private String status;
}
