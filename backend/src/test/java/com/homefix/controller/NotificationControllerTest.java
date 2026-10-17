package com.homefix.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.dto.NotificationResponseDto;
import com.homefix.entity.Notification;
import com.homefix.repository.NotificationRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationController notificationController;

    private UserDetails userDetails;
    private com.homefix.entity.User userEntity;

    @BeforeEach
    void setUp() {
        userDetails = User.withUsername("customer@example.com").password("pass").roles("CUSTOMER").build();
        userEntity = new com.homefix.entity.User();
        userEntity.setEmail("customer@example.com");
    }

    @Test
    void getNotificationsReturnsListForUser() {
        Notification n = new Notification();
        n.setUser(userEntity);
        n.setTitle("Price Revised");
        n.setMessage("Technician submitted revised charges");
        n.setType("PRICE_CHANGE_REQUEST");
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.findByUserEmailOrderByCreatedAtDesc("customer@example.com"))
                .thenReturn(List.of(n));

        List<NotificationResponseDto> results = notificationController.getNotifications(userDetails);
        assertEquals(1, results.size());
        assertEquals("Price Revised", results.get(0).title());
        assertFalse(results.get(0).isRead());
    }

    @Test
    void markAsReadUpdatesNotification() {
        Notification n = new Notification();
        n.setUser(userEntity);
        n.setTitle("Price Revised");
        n.setRead(false);

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(n));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArgument(0));

        NotificationResponseDto result = notificationController.markAsRead(userDetails, 1L);
        assertTrue(result.isRead());
        verify(notificationRepository).save(n);
    }

    @Test
    void markAsReadFailsForDifferentUser() {
        com.homefix.entity.User otherUser = new com.homefix.entity.User();
        otherUser.setEmail("other@example.com");

        Notification n = new Notification();
        n.setUser(otherUser);
        n.setTitle("Secret");

        when(notificationRepository.findById(2L)).thenReturn(Optional.of(n));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> notificationController.markAsRead(userDetails, 2L));
        assertEquals(403, ex.getStatusCode().value());
    }
}
