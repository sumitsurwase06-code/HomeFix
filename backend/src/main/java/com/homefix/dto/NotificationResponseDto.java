package com.homefix.dto;

import java.time.LocalDateTime;
import com.homefix.entity.Notification;

public record NotificationResponseDto(
    Long id,
    String title,
    String message,
    String type,
    boolean isRead,
    LocalDateTime createdAt
) {
    public static NotificationResponseDto from(Notification n) {
        return new NotificationResponseDto(
            n.getId(),
            n.getTitle(),
            n.getMessage(),
            n.getType(),
            n.isRead(),
            n.getCreatedAt()
        );
    }
}
