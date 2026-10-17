package com.homefix.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.homefix.dto.AdminDashboardResponse;
import com.homefix.model.BookingStatus;
import com.homefix.repository.BookingRepository;
import com.homefix.repository.CustomerProfileRepository;
import com.homefix.repository.TechnicianProfileRepository;

@ExtendWith(MockitoExtension.class)
class AdminDashboardServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private TechnicianProfileRepository technicianProfileRepository;

    @Test
    void returnsLiveProfileBookingAndRevenueMetrics() {
        when(customerProfileRepository.count()).thenReturn(12L);
        when(technicianProfileRepository.count()).thenReturn(5L);
        when(technicianProfileRepository.countByVerificationStatus("VERIFIED")).thenReturn(3L);
        when(technicianProfileRepository.countByVerificationStatus("PENDING")).thenReturn(2L);
        when(bookingRepository.count()).thenReturn(21L);
        when(bookingRepository.countByBookingStatus(BookingStatus.REQUESTED)).thenReturn(4L);
        when(bookingRepository.countByBookingStatus(BookingStatus.COMPLETED)).thenReturn(9L);
        when(bookingRepository.sumPaidBookingsBetween(any(LocalDateTime.class), any(LocalDateTime.class)))
            .thenReturn(new BigDecimal("12850.00"));
        when(technicianProfileRepository.findByVerificationStatusOrderByTechnicianIdAsc("PENDING"))
            .thenReturn(List.of());
        when(bookingRepository.findTop8ByOrderByPreferredDatetimeDesc()).thenReturn(List.of());

        AdminDashboardResponse response = new AdminDashboardService(
            bookingRepository,
            customerProfileRepository,
            technicianProfileRepository
        ).getDashboard();

        assertEquals(12L, response.totalCustomers());
        assertEquals(5L, response.totalTechnicians());
        assertEquals(3L, response.verifiedTechnicians());
        assertEquals(2L, response.pendingTechnicians());
        assertEquals(21L, response.totalBookings());
        assertEquals(4L, response.requestedBookings());
        assertEquals(9L, response.completedBookings());
        assertEquals(new BigDecimal("12850.00"), response.monthlyRevenue());
        assertEquals(List.of(), response.recentBookings());
    }
}