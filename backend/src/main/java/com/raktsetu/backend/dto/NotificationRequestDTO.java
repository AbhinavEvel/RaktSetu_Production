package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.NotificationType;

import lombok.Data;

@Data
public class NotificationRequestDTO {

    private Long userId;

    private String message;

    private NotificationType type;

}
