package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.AlertResponse;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AlertRespondRequest {

    @NotNull(message = "Response is required")
    private AlertResponse response;

}
