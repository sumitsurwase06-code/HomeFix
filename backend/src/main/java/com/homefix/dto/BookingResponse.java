package com.homefix.dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;

import com.homefix.entity.Booking;

public record BookingResponse(
    Long id,
    String bookingNumber,
    String service,
    String technicianName,
    String customerName,
    String problemDescription,
    LocalDateTime preferredDatetime,
    String status,
    String paymentStatus,
    BigDecimal visitingCharge,
    BigDecimal laborCharge,
    BigDecimal materialCharge,
    BigDecimal totalCustomerAmount,
    BigDecimal platformCommission,
    BigDecimal technicianPayout,
    String cancellationReason,
    boolean hasPendingPriceChange
) {
    public static BookingResponse from(Booking booking) {
        return from(booking, false);
    }

    public static BookingResponse from(Booking booking, boolean hasPendingPriceChange) {
        return new BookingResponse(
            booking.getId(),
            booking.getBookingNumber(),
            booking.getServiceCategory().getName(),
            booking.getTechnician().getUser().getFullName(),
            booking.getCustomer().getUser().getFullName(),
            booking.getProblemDescription(),
            booking.getPreferredDatetime(),
            booking.getBookingStatus().name(),
            booking.getPaymentStatus(),
            booking.getVisitingCharge(),
            booking.getLaborCharge(),
            booking.getMaterialCharge(),
            booking.getTotalCustomerAmount(),
            booking.getPlatformCommission(),
            booking.getTechnicianPayout(),
            booking.getCancellationReason(),
            hasPendingPriceChange
        );
    }
}
