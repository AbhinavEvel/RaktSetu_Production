package com.raktsetu.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raktsetu.backend.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long>{

    List<Notification> findByUserUserId(Long userId);

    List<Notification> findByUserUserIdAndIsReadFalse(Long userId);

}
