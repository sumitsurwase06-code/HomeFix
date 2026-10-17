package com.homefix.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homefix.dto.AdminDashboardResponse;
import com.homefix.dto.BookingResponse;
import com.homefix.dto.TechnicianApplicationResponse;
import com.homefix.model.BookingStatus;
import com.homefix.repository.BookingRepository;
import com.homefix.repository.CustomerProfileRepository;
import com.homefix.repository.TechnicianProfileRepository;

@Service
public class AdminDashboardService {

    private final BookingRepository bookingRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final TechnicianProfileRepository technicianProfileRepository;

    public AdminDashboardService(
        BookingRepository bookingRepository,
        CustomerProfileRepository customerProfileRepository,
        TechnicianProfileRepository technicianProfileRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.technicianProfileRepository = technicianProfileRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        YearMonth month = YearMonth.now();
        LocalDateTime start = month.atDay(1).atStartOfDay();
        LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();
        List<BookingResponse> recentBookings = bookingRepository.findTop8ByOrderByPreferredDatetimeDesc()
            .stream().map(BookingResponse::from).toList();
        List<TechnicianApplicationResponse> pendingApplications = technicianProfileRepository
            .findByVerificationStatusOrderByTechnicianIdAsc("PENDING")
            .stream().map(TechnicianApplicationResponse::from).toList();
        BigDecimal monthlyRevenue = bookingRepository.sumPaidBookingsBetween(start, end);

        return new AdminDashboardResponse(
            customerProfileRepository.count(),
            technicianProfileRepository.count(),
            technicianProfileRepository.countByVerificationStatus("VERIFIED"),
            technicianProfileRepository.countByVerificationStatus("PENDING"),
            bookingRepository.count(),
            bookingRepository.countByBookingStatus(BookingStatus.REQUESTED),
            bookingRepository.countByBookingStatus(BookingStatus.COMPLETED),
            monthlyRevenue == null ? BigDecimal.ZERO : monthlyRevenue,
            pendingApplications,
            recentBookings
        );
    }
}