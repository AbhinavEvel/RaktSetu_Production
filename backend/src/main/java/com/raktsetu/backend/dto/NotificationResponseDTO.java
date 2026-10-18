package com.raktsetu.backend.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationResponseDTO {

    private Long notificationId;

    private Long userId;

    private String message;

    private String type;

    private Boolean isRead;

    private LocalDateTime createdAt;

}
