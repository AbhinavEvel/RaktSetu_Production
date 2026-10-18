package com.raktsetu.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.NotificationRequestDTO;
import com.raktsetu.backend.dto.NotificationResponseDTO;
import com.raktsetu.backend.entity.Notification;
import com.raktsetu.backend.entity.User;
import com.raktsetu.backend.repository.NotificationRepository;
import com.raktsetu.backend.repository.UserRepository;
import com.raktsetu.backend.exception.ResourceNotFoundException;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // Create Notification
    public NotificationResponseDTO createNotification(NotificationRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());

        Notification saved = notificationRepository.save(notification);

        return mapToDTO(saved);
    }

    // Get All Notifications
    public List<NotificationResponseDTO> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Get Notifications By User
    public List<NotificationResponseDTO> getNotificationsByUser(Long userId) {

        return notificationRepository.findByUserUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Get Unread Notifications
    public List<NotificationResponseDTO> getUnreadNotifications(Long userId) {

        return notificationRepository.findByUserUserIdAndIsReadFalse(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Mark As Read
    public NotificationResponseDTO markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setIsRead(true);

        Notification updated = notificationRepository.save(notification);

        return mapToDTO(updated);
    }

    // DTO Mapper
    private NotificationResponseDTO mapToDTO(Notification notification) {

        NotificationResponseDTO dto = new NotificationResponseDTO();

        dto.setNotificationId(notification.getNotificationId());
        dto.setUserId(notification.getUser().getUserId());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType().name());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        return dto;
    }

}
