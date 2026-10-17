package com.homefix.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.dto.NotificationResponseDto;
import com.homefix.entity.Notification;
import com.homefix.repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<NotificationResponseDto> getNotifications(@AuthenticationPrincipal UserDetails user) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(user.getUsername())
            .stream().map(NotificationResponseDto::from).toList();
    }

    @PatchMapping("/{id}/read")
    public NotificationResponseDto markAsRead(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.getUser().getEmail().equalsIgnoreCase(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your notification");
        }

        notification.setRead(true);
        return NotificationResponseDto.from(notificationRepository.save(notification));
    }
}
