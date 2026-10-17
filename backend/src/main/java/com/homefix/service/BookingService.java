package com.homefix.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.dto.BookingResponse;
import com.homefix.dto.CreateBookingRequest;
import com.homefix.entity.Booking;
import com.homefix.entity.CustomerProfile;
import com.homefix.entity.ServiceCategory;
import com.homefix.entity.TechnicianProfile;
import com.homefix.model.BookingStatus;
import com.homefix.repository.BookingPriceChangeRequestRepository;
import com.homefix.repository.BookingRepository;
import com.homefix.repository.CustomerProfileRepository;
import com.homefix.repository.ServiceCategoryRepository;
import com.homefix.repository.TechnicianProfileRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final TechnicianProfileRepository technicianProfileRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final BookingPriceChangeRequestRepository priceChangeRepository;

    public BookingService(
        BookingRepository bookingRepository,
        CustomerProfileRepository customerProfileRepository,
        TechnicianProfileRepository technicianProfileRepository,
        ServiceCategoryRepository serviceCategoryRepository,
        BookingPriceChangeRequestRepository priceChangeRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.technicianProfileRepository = technicianProfileRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.priceChangeRepository = priceChangeRepository;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> customerBookings(String email) {
        return bookingRepository.findByCustomerUserEmailOrderByPreferredDatetimeDesc(email)
            .stream().map(b -> BookingResponse.from(b, priceChangeRepository.existsByBookingIdAndStatus(b.getId(), "PENDING_CUSTOMER_APPROVAL"))).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> technicianBookings(String email) {
        return bookingRepository.findByTechnicianUserEmailOrderByPreferredDatetimeAsc(email)
            .stream().map(b -> BookingResponse.from(b, priceChangeRepository.existsByBookingIdAndStatus(b.getId(), "PENDING_CUSTOMER_APPROVAL"))).toList();
    }

    @Transactional
    public BookingResponse createBooking(String email, CreateBookingRequest request) {
        CustomerProfile customer = customerProfileRepository.findByUserEmail(email)
            .orElseThrow(() -> new IllegalStateException("Customer profile is not available for this account"));
        TechnicianProfile technician = technicianProfileRepository.findById(request.technicianProfileId())
            .orElseThrow(() -> new IllegalArgumentException("Selected technician is not available for booking"));
        if (!technician.isPubliclyBookable() || !"VERIFIED".equals(technician.getVerificationStatus())) {
            throw new IllegalArgumentException("Selected technician is not available for booking");
        }

        ServiceCategory category = serviceCategoryRepository.findById(request.serviceCategoryId())
            .orElseThrow(() -> new IllegalArgumentException("Selected service is not available"));
        if (!category.isActive()) {
            throw new IllegalArgumentException("Selected service is not available");
        }

        Booking booking = new Booking();
        booking.setBookingNumber("HF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setCustomer(customer);
        booking.setTechnician(technician);
        booking.setServiceCategory(category);
        booking.setProblemDescription(request.problemDescription().trim());
        booking.setPreferredDatetime(request.preferredDatetime());
        booking.setVisitingCharge(technician.getVisitingCharge());
        booking.setBookingStatus(BookingStatus.REQUESTED);
        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelCustomerBooking(String email, long bookingId, String reason) {
        Booking booking = bookingRepository.findByIdAndCustomerUserEmail(bookingId, email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (booking.getBookingStatus() != BookingStatus.REQUESTED && booking.getBookingStatus() != BookingStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This booking can no longer be cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason == null || reason.isBlank() ? "Cancelled by customer" : reason.trim());
        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse updateStatus(String email, long bookingId, BookingStatus nextStatus) {
        TechnicianProfile technician = technicianProfileRepository.findByUserEmail(email)
            .orElseThrow(() -> new IllegalStateException("Technician profile is not available for this account"));
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getTechnician().getId().equals(technician.getId())) {
            throw new IllegalArgumentException("This booking is not assigned to your account");
        }

        BookingStatus currentStatus = booking.getBookingStatus();
        boolean allowed = switch (currentStatus) {
            case REQUESTED -> nextStatus == BookingStatus.ACCEPTED || nextStatus == BookingStatus.CANCELLED;
            case ACCEPTED -> nextStatus == BookingStatus.IN_PROGRESS || nextStatus == BookingStatus.CANCELLED;
            case IN_PROGRESS -> nextStatus == BookingStatus.COMPLETED;
            case COMPLETED, CANCELLED -> false;
        };

        if (!allowed) {
            throw new IllegalArgumentException("Cannot change booking status from " + currentStatus + " to " + nextStatus);
        }

        booking.setBookingStatus(nextStatus);
        return BookingResponse.from(bookingRepository.save(booking));
    }
}
