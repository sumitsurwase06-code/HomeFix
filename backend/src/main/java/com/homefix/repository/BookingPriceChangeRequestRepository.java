package com.homefix.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homefix.entity.BookingPriceChangeRequest;

@Repository
public interface BookingPriceChangeRequestRepository extends JpaRepository<BookingPriceChangeRequest, Long> {

    List<BookingPriceChangeRequest> findByBookingIdOrderByCreatedAtDesc(Long bookingId);

    Optional<BookingPriceChangeRequest> findFirstByBookingIdAndStatus(Long bookingId, String status);

    boolean existsByBookingIdAndStatus(Long bookingId, String status);

    List<BookingPriceChangeRequest> findByCustomerUserEmailAndStatusOrderByCreatedAtDesc(String email, String status);

    List<BookingPriceChangeRequest> findByCustomerUserEmailOrderByCreatedAtDesc(String email);

    List<BookingPriceChangeRequest> findByTechnicianUserEmailOrderByCreatedAtDesc(String email);

    Optional<BookingPriceChangeRequest> findByIdAndCustomerUserEmail(Long id, String email);
}
