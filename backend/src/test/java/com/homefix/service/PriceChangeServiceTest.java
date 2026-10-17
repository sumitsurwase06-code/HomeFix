package com.homefix.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.dto.PriceChangeRequestDto;
import com.homefix.dto.PriceChangeResponseDto;
import com.homefix.entity.Booking;
import com.homefix.entity.BookingPriceChangeRequest;
import com.homefix.entity.CustomerProfile;
import com.homefix.entity.Notification;
import com.homefix.entity.ServiceCategory;
import com.homefix.entity.TechnicianProfile;
import com.homefix.entity.User;
import com.homefix.model.BookingStatus;
import com.homefix.repository.BookingPriceChangeRequestRepository;
import com.homefix.repository.BookingRepository;
import com.homefix.repository.CustomerProfileRepository;
import com.homefix.repository.NotificationRepository;
import com.homefix.repository.TechnicianProfileRepository;

@ExtendWith(MockitoExtension.class)
class PriceChangeServiceTest {

    @Mock
    private BookingPriceChangeRequestRepository priceChangeRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TechnicianProfileRepository technicianProfileRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private NotificationRepository notificationRepository;

    private PriceChangeService priceChangeService;

    private User techUser;
    private User customerUser;
    private TechnicianProfile technician;
    private CustomerProfile customer;
    private Booking booking;

    @BeforeEach
    void setUp() {
        priceChangeService = new PriceChangeService(
            priceChangeRepository,
            bookingRepository,
            technicianProfileRepository,
            customerProfileRepository,
            notificationRepository
        );

        techUser = new User();
        techUser.setEmail("tech@example.com");
        techUser.setFullName("John Fixer");

        technician = new TechnicianProfile();
        technician.setId(10L);
        technician.setUser(techUser);

        customerUser = new User();
        customerUser.setEmail("customer@example.com");
        customerUser.setFullName("Jane Customer");

        customer = new CustomerProfile();
        customer.setId(20L);
        customer.setUser(customerUser);

        ServiceCategory category = new ServiceCategory();
        category.setName("Plumbing");

        booking = new Booking();
        booking.setId(100L);
        booking.setBookingNumber("HF-100");
        booking.setTechnician(technician);
        booking.setCustomer(customer);
        booking.setServiceCategory(category);
        booking.setBookingStatus(BookingStatus.IN_PROGRESS);
        booking.setVisitingCharge(new BigDecimal("299.00"));
        booking.setLaborCharge(new BigDecimal("200.00"));
        booking.setMaterialCharge(new BigDecimal("0.00"));
        booking.setTotalCustomerAmount(new BigDecimal("499.00"));
        booking.setPlatformCommission(new BigDecimal("50.00"));
        booking.setTechnicianPayout(new BigDecimal("449.00"));
        booking.setPaymentStatus("PENDING");
    }

    @Test
    void technicianCanSubmitPriceProposalWithIncreasedCharges() {
        when(technicianProfileRepository.findByUserEmail("tech@example.com")).thenReturn(Optional.of(technician));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(priceChangeRepository.existsByBookingIdAndStatus(100L, "PENDING_CUSTOMER_APPROVAL")).thenReturn(false);
        when(priceChangeRepository.save(any(BookingPriceChangeRequest.class))).thenAnswer(i -> {
            BookingPriceChangeRequest r = i.getArgument(0);
            r.setId(1L);
            return r;
        });

        PriceChangeRequestDto dto = new PriceChangeRequestDto(
            new BigDecimal("299.00"),
            new BigDecimal("500.00"),
            new BigDecimal("350.00"),
            "Replaced heavy copper pipe fitting and additional labor required"
        );

        PriceChangeResponseDto result = priceChangeService.submitProposal("tech@example.com", 100L, dto);

        assertNotNull(result);
        assertEquals(new BigDecimal("1149.00"), result.proposedCustomerTotal());
        assertEquals(new BigDecimal("114.90"), result.proposedPlatformFee());
        assertEquals(new BigDecimal("1034.10"), result.proposedTechnicianPayout());
        assertEquals("PENDING_CUSTOMER_APPROVAL", result.status());

        // Verify notification saved for customer
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void submittingIdenticalChargesThrowsBadRequest() {
        when(technicianProfileRepository.findByUserEmail("tech@example.com")).thenReturn(Optional.of(technician));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(priceChangeRepository.existsByBookingIdAndStatus(100L, "PENDING_CUSTOMER_APPROVAL")).thenReturn(false);

        PriceChangeRequestDto dto = new PriceChangeRequestDto(
            new BigDecimal("299.00"),
            new BigDecimal("200.00"),
            new BigDecimal("0.00"),
            "No change"
        );

        assertThrows(ResponseStatusException.class, () ->
            priceChangeService.submitProposal("tech@example.com", 100L, dto)
        );
    }

    @Test
    void cannotSubmitIfProposalAlreadyPending() {
        when(technicianProfileRepository.findByUserEmail("tech@example.com")).thenReturn(Optional.of(technician));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(priceChangeRepository.existsByBookingIdAndStatus(100L, "PENDING_CUSTOMER_APPROVAL")).thenReturn(true);

        PriceChangeRequestDto dto = new PriceChangeRequestDto(
            new BigDecimal("299.00"),
            new BigDecimal("400.00"),
            new BigDecimal("100.00"),
            "More work needed"
        );

        assertThrows(ResponseStatusException.class, () ->
            priceChangeService.submitProposal("tech@example.com", 100L, dto)
        );
    }

    @Test
    void customerAcceptsProposalUpdatesApprovedInvoiceAtomically() {
        BookingPriceChangeRequest request = new BookingPriceChangeRequest();
        request.setId(5L);
        request.setBooking(booking);
        request.setTechnician(technician);
        request.setCustomer(customer);
        request.setOriginalVisitingCharge(new BigDecimal("299.00"));
        request.setOriginalLaborCharge(new BigDecimal("200.00"));
        request.setOriginalMaterialCharge(new BigDecimal("0.00"));
        request.setOriginalCustomerTotal(new BigDecimal("499.00"));
        request.setProposedVisitingCharge(new BigDecimal("299.00"));
        request.setProposedLaborCharge(new BigDecimal("600.00"));
        request.setProposedMaterialCharge(new BigDecimal("400.00"));
        request.setProposedCustomerTotal(new BigDecimal("1299.00"));
        request.setProposedPlatformFee(new BigDecimal("129.90"));
        request.setProposedTechnicianPayout(new BigDecimal("1169.10"));
        request.setStatus("PENDING_CUSTOMER_APPROVAL");

        when(priceChangeRepository.findById(5L)).thenReturn(Optional.of(request));
        when(bookingRepository.save(booking)).thenReturn(booking);
        when(priceChangeRepository.save(request)).thenReturn(request);

        PriceChangeResponseDto approved = priceChangeService.approveProposal("customer@example.com", 5L);

        assertEquals("APPROVED", approved.status());
        assertEquals(new BigDecimal("1299.00"), booking.getTotalCustomerAmount());
        assertEquals(new BigDecimal("600.00"), booking.getLaborCharge());
        assertEquals(new BigDecimal("400.00"), booking.getMaterialCharge());
        assertEquals(new BigDecimal("129.90"), booking.getPlatformCommission());
        assertEquals(new BigDecimal("1169.10"), booking.getTechnicianPayout());

        // Verify booking was updated and saved
        verify(bookingRepository).save(booking);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void customerRejectsProposalPreservesOriginalInvoice() {
        BookingPriceChangeRequest request = new BookingPriceChangeRequest();
        request.setId(6L);
        request.setBooking(booking);
        request.setTechnician(technician);
        request.setCustomer(customer);
        request.setOriginalVisitingCharge(new BigDecimal("299.00"));
        request.setOriginalLaborCharge(new BigDecimal("200.00"));
        request.setOriginalMaterialCharge(new BigDecimal("0.00"));
        request.setOriginalCustomerTotal(new BigDecimal("499.00"));
        request.setProposedVisitingCharge(new BigDecimal("299.00"));
        request.setProposedLaborCharge(new BigDecimal("800.00"));
        request.setProposedMaterialCharge(new BigDecimal("500.00"));
        request.setProposedCustomerTotal(new BigDecimal("1599.00"));
        request.setProposedPlatformFee(new BigDecimal("159.90"));
        request.setProposedTechnicianPayout(new BigDecimal("1439.10"));
        request.setStatus("PENDING_CUSTOMER_APPROVAL");

        when(priceChangeRepository.findById(6L)).thenReturn(Optional.of(request));
        when(priceChangeRepository.save(request)).thenReturn(request);

        PriceChangeResponseDto rejected = priceChangeService.rejectProposal("customer@example.com", 6L, "Too expensive, please proceed with standard repair only");

        assertEquals("REJECTED", rejected.status());
        // Crucial test: original booking invoice must NOT change
        assertEquals(new BigDecimal("499.00"), booking.getTotalCustomerAmount());
        assertEquals(new BigDecimal("200.00"), booking.getLaborCharge());
        assertEquals(new BigDecimal("0.00"), booking.getMaterialCharge());

        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void unauthorizedCustomerCannotDecideProposal() {
        BookingPriceChangeRequest request = new BookingPriceChangeRequest();
        request.setId(7L);
        request.setBooking(booking);
        request.setCustomer(customer);
        request.setStatus("PENDING_CUSTOMER_APPROVAL");

        when(priceChangeRepository.findById(7L)).thenReturn(Optional.of(request));

        assertThrows(ResponseStatusException.class, () ->
            priceChangeService.approveProposal("othercustomer@example.com", 7L)
        );
    }
}
