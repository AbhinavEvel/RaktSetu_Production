package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.InventoryStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private InventoryStatus status;

}
