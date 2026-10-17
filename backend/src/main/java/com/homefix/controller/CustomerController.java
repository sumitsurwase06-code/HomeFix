package com.homefix.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.homefix.dto.BookingResponse;
import com.homefix.dto.CancelBookingRequest;
import com.homefix.dto.CreateBookingRequest;
import com.homefix.dto.ServiceCategorySummary;
import com.homefix.dto.TechnicianSummary;
import com.homefix.dto.PriceChangeDecisionDto;
import com.homefix.dto.PriceChangeResponseDto;
import com.homefix.repository.ServiceCategoryRepository;
import com.homefix.repository.TechnicianProfileRepository;
import com.homefix.service.BookingService;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    private final BookingService bookingService;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final TechnicianProfileRepository technicianProfileRepository;
    private final com.homefix.service.PriceChangeService priceChangeService;

    public CustomerController(
        BookingService bookingService,
        ServiceCategoryRepository serviceCategoryRepository,
        TechnicianProfileRepository technicianProfileRepository,
        com.homefix.service.PriceChangeService priceChangeService
    ) {
        this.bookingService = bookingService;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.technicianProfileRepository = technicianProfileRepository;
        this.priceChangeService = priceChangeService;
    }

    @GetMapping("/dashboard")
    public java.util.Map<String, Object> dashboard(@AuthenticationPrincipal UserDetails user) {
        List<BookingResponse> bookings = bookingService.customerBookings(user.getUsername());
        return java.util.Map.of(
            "message", "Customer dashboard ready",
            "bookings", bookings.size(),
            "upcomingVisits", bookings.stream().filter(item -> item.status().equals("REQUESTED") || item.status().equals("ACCEPTED")).count()
        );
    }

    @GetMapping("/bookings")
    public List<BookingResponse> bookings(@AuthenticationPrincipal UserDetails user) {
        return bookingService.customerBookings(user.getUsername());
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
        @AuthenticationPrincipal UserDetails user,
        @Valid @RequestBody CreateBookingRequest request
    ) {
        try {
            return bookingService.createBooking(user.getUsername(), request);
        } catch (IllegalArgumentException | IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    @PatchMapping("/bookings/{bookingId}/cancel")
    public BookingResponse cancelBooking(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable long bookingId,
        @Valid @RequestBody CancelBookingRequest request
    ) {
        return bookingService.cancelCustomerBooking(user.getUsername(), bookingId, request.reason());
    }

    @GetMapping("/services")
    public List<ServiceCategorySummary> services() {
        return serviceCategoryRepository.findByActiveTrueOrderByNameAsc().stream()
            .map(ServiceCategorySummary::from).toList();
    }

    @GetMapping("/technicians")
    public List<TechnicianSummary> technicians(@RequestParam(required = false) Long serviceCategoryId) {
        List<com.homefix.entity.TechnicianProfile> technicians;
        if (serviceCategoryId == null) {
            technicians = technicianProfileRepository.findByVerificationStatusAndPubliclyBookableOrderByAverageRatingDesc("VERIFIED", true);
        } else {
            var category = serviceCategoryRepository.findById(serviceCategoryId)
                .filter(item -> item.isActive())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected service is not available"));
            technicians = technicianProfileRepository.findBookableByServiceSkill(category.getName());
        }
        return technicians
            .stream().map(TechnicianSummary::from).toList();
    }

    @GetMapping({"/price-changes/pending", "/price-change-requests/pending"})
    public List<PriceChangeResponseDto> pendingPriceChanges(@AuthenticationPrincipal UserDetails user) {
        return priceChangeService.getCustomerPendingProposals(user.getUsername());
    }

    @GetMapping({"/bookings/{bookingId}/price-change/history", "/bookings/{bookingId}/price-change-requests"})
    public List<PriceChangeResponseDto> getPriceChangeHistory(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable String bookingId
    ) {
        return priceChangeService.getBookingProposalHistory(bookingId, user.getUsername());
    }

    @PostMapping({"/price-changes/{requestId}/approve", "/price-change-requests/{requestId}/approve"})
    public PriceChangeResponseDto approvePriceChange(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable long requestId
    ) {
        return priceChangeService.approveProposal(user.getUsername(), requestId);
    }

    @PostMapping({"/price-changes/{requestId}/reject", "/price-change-requests/{requestId}/reject"})
    public PriceChangeResponseDto rejectPriceChange(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable long requestId,
        @RequestBody(required = false) PriceChangeDecisionDto decision
    ) {
        String reason = decision != null ? decision.reason() : null;
        return priceChangeService.rejectProposal(user.getUsername(), requestId, reason);
    }
}
