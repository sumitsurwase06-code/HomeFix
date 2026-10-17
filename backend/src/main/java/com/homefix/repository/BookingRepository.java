package com.homefix.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import com.homefix.entity.Booking;
import com.homefix.model.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingNumber(String bookingNumber);
    Optional<Booking> findByIdAndCustomerUserEmail(Long id, String email);
    List<Booking> findByCustomerUserEmailOrderByPreferredDatetimeDesc(String email);
    List<Booking> findByTechnicianUserEmailOrderByPreferredDatetimeAsc(String email);
    long countByTechnicianUserEmailAndBookingStatus(String email, BookingStatus status);
    long countByBookingStatus(BookingStatus status);
    List<Booking> findTop8ByOrderByPreferredDatetimeDesc();

    @Query("select coalesce(sum(booking.totalCustomerAmount), 0) from Booking booking "
        + "where booking.paymentStatus = 'PAID' "
        + "and booking.preferredDatetime >= :start and booking.preferredDatetime < :end")
    BigDecimal sumPaidBookingsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
