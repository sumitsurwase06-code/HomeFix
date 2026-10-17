package com.homefix.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import com.homefix.entity.BookingPriceChangeRequest;

public record PriceChangeResponseDto(
    Long id,
    Long bookingId,
    String bookingNumber,
    String serviceName,
    String technicianName,
    String customerName,
    BigDecimal originalVisitingCharge,
    BigDecimal originalLaborCharge,
    BigDecimal originalMaterialCharge,
    BigDecimal originalCustomerTotal,
    BigDecimal proposedVisitingCharge,
    BigDecimal proposedLaborCharge,
    BigDecimal proposedMaterialCharge,
    BigDecimal proposedCustomerTotal,
    BigDecimal differenceAmount,
    Double percentageChange,
    BigDecimal proposedPlatformFee,
    BigDecimal proposedTechnicianPayout,
    String technicianReason,
    String customerRejectionReason,
    String status,
    LocalDateTime createdAt,
    LocalDateTime decidedAt
) {
    public static PriceChangeResponseDto from(BookingPriceChangeRequest req) {
        BigDecimal diff = req.getProposedCustomerTotal().subtract(req.getOriginalCustomerTotal());
        Double pct = 0.0;
        if (req.getOriginalCustomerTotal().compareTo(BigDecimal.ZERO) > 0) {
            pct = diff.multiply(BigDecimal.valueOf(100))
                      .divide(req.getOriginalCustomerTotal(), 2, RoundingMode.HALF_UP)
                      .doubleValue();
        }

        return new PriceChangeResponseDto(
            req.getId(),
            req.getBooking().getId(),
            req.getBooking().getBookingNumber(),
            req.getBooking().getServiceCategory().getName(),
            req.getTechnician().getUser().getFullName(),
            req.getCustomer().getUser().getFullName(),
            req.getOriginalVisitingCharge(),
            req.getOriginalLaborCharge(),
            req.getOriginalMaterialCharge(),
            req.getOriginalCustomerTotal(),
            req.getProposedVisitingCharge(),
            req.getProposedLaborCharge(),
            req.getProposedMaterialCharge(),
            req.getProposedCustomerTotal(),
            diff,
            pct,
            req.getProposedPlatformFee(),
            req.getProposedTechnicianPayout(),
            req.getTechnicianReason(),
            req.getCustomerRejectionReason(),
            req.getStatus(),
            req.getCreatedAt(),
            req.getDecidedAt()
        );
    }
}
