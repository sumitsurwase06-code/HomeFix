package com.homefix.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.dto.PriceChangeRequestDto;
import com.homefix.dto.PriceChangeResponseDto;
import com.homefix.entity.Booking;
import com.homefix.entity.BookingPriceChangeRequest;
import com.homefix.entity.CustomerProfile;
import com.homefix.entity.Notification;
import com.homefix.entity.TechnicianProfile;
import com.homefix.model.BookingStatus;
import com.homefix.repository.BookingPriceChangeRequestRepository;
import com.homefix.repository.BookingRepository;
import com.homefix.repository.CustomerProfileRepository;
import com.homefix.repository.NotificationRepository;
import com.homefix.repository.TechnicianProfileRepository;

@Service
public class PriceChangeService {

    private final BookingPriceChangeRequestRepository priceChangeRepository;
    private final BookingRepository bookingRepository;
    private final TechnicianProfileRepository technicianProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final NotificationRepository notificationRepository;

    public PriceChangeService(
        BookingPriceChangeRequestRepository priceChangeRepository,
        BookingRepository bookingRepository,
        TechnicianProfileRepository technicianProfileRepository,
        CustomerProfileRepository customerProfileRepository,
        NotificationRepository notificationRepository
    ) {
        this.priceChangeRepository = priceChangeRepository;
        this.bookingRepository = bookingRepository;
        this.technicianProfileRepository = technicianProfileRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.notificationRepository = notificationRepository;
    }

    public Booking findBooking(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking reference cannot be empty");
        }
        try {
            Long numericId = Long.parseLong(identifier);
            var byId = bookingRepository.findById(numericId);
            if (byId.isPresent()) return byId.get();
        } catch (NumberFormatException ignored) {}
        return bookingRepository.findByBookingNumber(identifier)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found with reference " + identifier));
    }

    /**
     * Technician submits a revised price proposal for customer approval by string identifier.
     */
    @Transactional
    public PriceChangeResponseDto submitProposal(String technicianEmail, String bookingIdentifier, PriceChangeRequestDto request) {
        Booking booking = findBooking(bookingIdentifier);
        return submitProposalForBooking(technicianEmail, booking, request);
    }

    /**
     * Technician submits a revised price proposal for customer approval by Long ID.
     */
    @Transactional
    public PriceChangeResponseDto submitProposal(String technicianEmail, Long bookingId, PriceChangeRequestDto request) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        return submitProposalForBooking(technicianEmail, booking, request);
    }

    private PriceChangeResponseDto submitProposalForBooking(String technicianEmail, Booking booking, PriceChangeRequestDto request) {
        TechnicianProfile technician = technicianProfileRepository.findByUserEmail(technicianEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Technician profile not found"));

        if (!booking.getTechnician().getId().equals(technician.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This booking is not assigned to your technician account");
        }

        if (booking.getBookingStatus() == BookingStatus.COMPLETED || booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot modify pricing for completed or cancelled bookings");
        }

        if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment is already settled for this booking. Charges cannot be altered.");
        }

        // Prevent duplicate concurrent pending proposals
        if (priceChangeRepository.existsByBookingIdAndStatus(booking.getId(), "PENDING_CUSTOMER_APPROVAL")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A price change proposal is already awaiting customer approval for this booking.");
        }

        BigDecimal proposedVisiting = request.visitingCharge().setScale(2, RoundingMode.HALF_UP);
        BigDecimal proposedLabor = request.laborCharge().setScale(2, RoundingMode.HALF_UP);
        BigDecimal proposedMaterial = request.materialCharge().setScale(2, RoundingMode.HALF_UP);

        if (proposedVisiting.compareTo(BigDecimal.ZERO) < 0 ||
            proposedLabor.compareTo(BigDecimal.ZERO) < 0 ||
            proposedMaterial.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charges cannot be negative.");
        }

        BigDecimal proposedTotal = proposedVisiting.add(proposedLabor).add(proposedMaterial);

        BigDecimal currentVisiting = booking.getVisitingCharge() != null ? booking.getVisitingCharge() : BigDecimal.ZERO;
        BigDecimal currentLabor = booking.getLaborCharge() != null ? booking.getLaborCharge() : BigDecimal.ZERO;
        BigDecimal currentMaterial = booking.getMaterialCharge() != null ? booking.getMaterialCharge() : BigDecimal.ZERO;
        BigDecimal currentTotal = booking.getTotalCustomerAmount() != null && booking.getTotalCustomerAmount().compareTo(BigDecimal.ZERO) > 0
            ? booking.getTotalCustomerAmount()
            : currentVisiting.add(currentLabor).add(currentMaterial);

        // Disallow submitting without any actual changes
        if (proposedVisiting.compareTo(currentVisiting) == 0 &&
            proposedLabor.compareTo(currentLabor) == 0 &&
            proposedMaterial.compareTo(currentMaterial) == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Proposed charges are identical to the currently approved charges.");
        }

        // Standard commission: 10% platform fee
        BigDecimal proposedPlatformFee = proposedTotal.multiply(BigDecimal.valueOf(0.10)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal proposedPayout = proposedTotal.subtract(proposedPlatformFee);

        BookingPriceChangeRequest changeRequest = new BookingPriceChangeRequest();
        changeRequest.setBooking(booking);
        changeRequest.setTechnician(technician);
        changeRequest.setCustomer(booking.getCustomer());
        changeRequest.setOriginalVisitingCharge(currentVisiting);
        changeRequest.setOriginalLaborCharge(currentLabor);
        changeRequest.setOriginalMaterialCharge(currentMaterial);
        changeRequest.setOriginalCustomerTotal(currentTotal);
        changeRequest.setProposedVisitingCharge(proposedVisiting);
        changeRequest.setProposedLaborCharge(proposedLabor);
        changeRequest.setProposedMaterialCharge(proposedMaterial);
        changeRequest.setProposedCustomerTotal(proposedTotal);
        changeRequest.setProposedPlatformFee(proposedPlatformFee);
        changeRequest.setProposedTechnicianPayout(proposedPayout);
        changeRequest.setTechnicianReason(request.reason().trim());
        changeRequest.setStatus("PENDING_CUSTOMER_APPROVAL");
        changeRequest.setCreatedAt(LocalDateTime.now());

        BookingPriceChangeRequest saved = priceChangeRepository.save(changeRequest);

        // Notify customer
        createNotification(
            booking.getCustomer().getUser(),
            "Price Revision Proposal: #" + booking.getBookingNumber(),
            "Technician " + technician.getUser().getFullName() + " submitted a revised quotation of ₹" +
                proposedTotal + " for your " + booking.getServiceCategory().getName() + " service. Reason: \"" +
                request.reason().trim() + "\". Please review and approve or reject.",
            "PRICE_CHANGE_REQUEST"
        );

        return PriceChangeResponseDto.from(saved);
    }

    /**
     * Get all pending price proposals for the authenticated customer.
     */
    @Transactional(readOnly = true)
    public List<PriceChangeResponseDto> getCustomerPendingProposals(String customerEmail) {
        return priceChangeRepository.findByCustomerUserEmailAndStatusOrderByCreatedAtDesc(customerEmail, "PENDING_CUSTOMER_APPROVAL")
            .stream().map(PriceChangeResponseDto::from).toList();
    }

    /**
     * Get full history of proposals for a specific booking by string identifier.
     */
    @Transactional(readOnly = true)
    public List<PriceChangeResponseDto> getBookingProposalHistory(String bookingIdentifier, String userEmail) {
        Booking booking = findBooking(bookingIdentifier);
        return getBookingProposalHistoryForBooking(booking, userEmail);
    }

    /**
     * Get full history of proposals for a specific booking by Long ID.
     */
    @Transactional(readOnly = true)
    public List<PriceChangeResponseDto> getBookingProposalHistory(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        return getBookingProposalHistoryForBooking(booking, userEmail);
    }

    private List<PriceChangeResponseDto> getBookingProposalHistoryForBooking(Booking booking, String userEmail) {
        boolean isAuthorized = booking.getCustomer().getUser().getEmail().equalsIgnoreCase(userEmail) ||
                               booking.getTechnician().getUser().getEmail().equalsIgnoreCase(userEmail);

        if (!isAuthorized) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this booking's pricing history");
        }

        return priceChangeRepository.findByBookingIdOrderByCreatedAtDesc(booking.getId())
            .stream().map(PriceChangeResponseDto::from).toList();
    }

    /**
     * Customer accepts the proposed price change.
     */
    @Transactional
    public PriceChangeResponseDto approveProposal(String customerEmail, Long requestId) {
        BookingPriceChangeRequest request = priceChangeRepository.findById(requestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Price change request not found"));

        if (!request.getCustomer().getUser().getEmail().equalsIgnoreCase(customerEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to decide this proposal");
        }

        if (!"PENDING_CUSTOMER_APPROVAL".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This proposal has already been " + request.getStatus());
        }

        Booking booking = request.getBooking();

        // Atomically update approved charges on the booking
        booking.setVisitingCharge(request.getProposedVisitingCharge());
        booking.setLaborCharge(request.getProposedLaborCharge());
        booking.setMaterialCharge(request.getProposedMaterialCharge());
        booking.setTotalCustomerAmount(request.getProposedCustomerTotal());
        booking.setPlatformCommission(request.getProposedPlatformFee());
        booking.setTechnicianPayout(request.getProposedTechnicianPayout());
        bookingRepository.save(booking);

        // Update proposal status
        request.setStatus("APPROVED");
        request.setDecidedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        BookingPriceChangeRequest approved = priceChangeRepository.save(request);

        // Notify technician
        createNotification(
            request.getTechnician().getUser(),
            "Quotation Approved: #" + booking.getBookingNumber(),
            "Customer " + request.getCustomer().getUser().getFullName() + " approved your revised quotation of ₹" +
                request.getProposedCustomerTotal() + ". New invoice amount is active.",
            "PRICE_CHANGE_APPROVED"
        );

        return PriceChangeResponseDto.from(approved);
    }

    /**
     * Customer declines the proposed price change.
     */
    @Transactional
    public PriceChangeResponseDto rejectProposal(String customerEmail, Long requestId, String reason) {
        BookingPriceChangeRequest request = priceChangeRepository.findById(requestId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Price change request not found"));

        if (!request.getCustomer().getUser().getEmail().equalsIgnoreCase(customerEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to decide this proposal");
        }

        if (!"PENDING_CUSTOMER_APPROVAL".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This proposal has already been " + request.getStatus());
        }

        // Keep the approved booking invoice completely untouched
        request.setStatus("REJECTED");
        request.setCustomerRejectionReason(reason != null && !reason.isBlank() ? reason.trim() : "Declined by customer");
        request.setDecidedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        BookingPriceChangeRequest rejected = priceChangeRepository.save(request);

        // Notify technician
        createNotification(
            request.getTechnician().getUser(),
            "Quotation Declined: #" + request.getBooking().getBookingNumber(),
            "Customer " + request.getCustomer().getUser().getFullName() + " declined your price change proposal." +
                (reason != null && !reason.isBlank() ? " Remark: \"" + reason.trim() + "\"" : "") +
                " Previous approved quotation of ₹" + request.getOriginalCustomerTotal() + " remains active.",
            "PRICE_CHANGE_REJECTED"
        );

        return PriceChangeResponseDto.from(rejected);
    }

    private void createNotification(com.homefix.entity.User user, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
}
