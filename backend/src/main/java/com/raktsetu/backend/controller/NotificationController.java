package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.raktsetu.backend.dto.NotificationRequestDTO;
import com.raktsetu.backend.dto.NotificationResponseDTO;
import com.raktsetu.backend.security.CustomUserDetails;
import com.raktsetu.backend.service.NotificationService;
import com.raktsetu.backend.exception.BadRequestException;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Create Notification — Admin only (this is a system/admin action, not something
    // any logged-in user should be able to trigger for arbitrary recipients)
    @PostMapping("/create")
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @RequestBody NotificationRequestDTO dto,
            Authentication authentication) {

        requireAdmin(authentication);
        return ResponseEntity.ok(notificationService.createNotification(dto));
    }

    // Get All Notifications — Admin only
    @GetMapping("/all")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications(Authentication authentication) {

        requireAdmin(authentication);
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    // Get Notifications By User — only the user themselves (or an admin) can view
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails,
            Authentication authentication) {

        requireOwnerOrAdmin(userId, userDetails, authentication);
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId));
    }

    // Get Unread Notifications — only the user themselves (or an admin) can view
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails,
            Authentication authentication) {

        requireOwnerOrAdmin(userId, userDetails, authentication);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    // Mark Notification As Read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable Long notificationId) {

        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }

    private void requireOwnerOrAdmin(Long userId, UserDetails userDetails, Authentication authentication) {
        Long callerUserId = ((CustomUserDetails) userDetails).getUserId();

        if (callerUserId.equals(userId)) {
            return;
        }

        if (!isAdmin(authentication)) {
            throw new BadRequestException("Access denied: you can only view your own notifications");
        }
    }

    private void requireAdmin(Authentication authentication) {
        if (!isAdmin(authentication)) {
            throw new BadRequestException("Access denied: Admins only");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_Admin"));
    }
}
