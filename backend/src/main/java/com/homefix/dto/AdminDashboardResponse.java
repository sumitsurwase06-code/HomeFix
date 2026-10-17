package com.homefix.dto;

import java.math.BigDecimal;
import java.util.List;

public record AdminDashboardResponse(
    long totalCustomers,
    long totalTechnicians,
    long verifiedTechnicians,
    long pendingTechnicians,
    long totalBookings,
    long requestedBookings,
    long completedBookings,
    BigDecimal monthlyRevenue,
    List<TechnicianApplicationResponse> pendingApplications,
    List<BookingResponse> recentBookings
) {
}