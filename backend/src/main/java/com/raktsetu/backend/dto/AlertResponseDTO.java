package com.raktsetu.backend.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AlertResponseDTO {

    private Long alertId;

    private Long requestId;

    private Long donorId;

    private String donorName;

    private LocalDateTime sentAt;

    private String response;

    private LocalDateTime respondedAt;

}
