package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.RequestStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private RequestStatus status;

}
