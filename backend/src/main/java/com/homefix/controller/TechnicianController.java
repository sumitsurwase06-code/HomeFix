package com.homefix.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.dto.BookingResponse;
import com.homefix.dto.BookingStatusRequest;
import com.homefix.service.BookingService;

import com.homefix.dto.PriceChangeRequestDto;
import com.homefix.dto.PriceChangeResponseDto;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/technician")
@PreAuthorize("hasRole('TECHNICIAN')")
public class TechnicianController {

    private final BookingService bookingService;
    private final com.homefix.service.PriceChangeService priceChangeService;

    public TechnicianController(BookingService bookingService, com.homefix.service.PriceChangeService priceChangeService) {
        this.bookingService = bookingService;
        this.priceChangeService = priceChangeService;
    }

    @GetMapping("/dashboard")
    public java.util.Map<String, Object> dashboard(@AuthenticationPrincipal UserDetails user) {
        List<BookingResponse> bookings = bookingService.technicianBookings(user.getUsername());
        return java.util.Map.of(
            "message", "Technician dashboard ready",
            "pendingBookings", bookings.stream().filter(item -> item.status().equals("REQUESTED")).count(),
            "completedJobs", bookings.stream().filter(item -> item.status().equals("COMPLETED")).count()
        );
    }

    @GetMapping("/bookings")
    public List<BookingResponse> bookings(@AuthenticationPrincipal UserDetails user) {
        return bookingService.technicianBookings(user.getUsername());
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public BookingResponse updateStatus(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable long bookingId,
        @Valid @RequestBody BookingStatusRequest request
    ) {
        try {
            return bookingService.updateStatus(user.getUsername(), bookingId, request.status());
        } catch (IllegalArgumentException | IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    @PostMapping("/bookings/{bookingId}/price-change")
    public PriceChangeResponseDto submitPriceChange(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable String bookingId,
        @Valid @RequestBody PriceChangeRequestDto request
    ) {
        return priceChangeService.submitProposal(user.getUsername(), bookingId, request);
    }

    @GetMapping("/bookings/{bookingId}/price-change/history")
    public List<PriceChangeResponseDto> getPriceChangeHistory(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable String bookingId
    ) {
        return priceChangeService.getBookingProposalHistory(bookingId, user.getUsername());
    }
}
