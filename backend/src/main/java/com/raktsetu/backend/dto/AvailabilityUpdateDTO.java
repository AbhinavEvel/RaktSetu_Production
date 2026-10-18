package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.Availability;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvailabilityUpdateDTO {

    @NotNull(message = "Availability is required")
    private Availability isAvailable;

}
