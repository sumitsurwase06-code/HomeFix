package com.homefix.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.entity.Booking;
import com.homefix.entity.CustomerProfile;
import com.homefix.entity.ServiceCategory;
import com.homefix.entity.TechnicianProfile;
import com.homefix.entity.User;
import com.homefix.model.BookingStatus;
import com.homefix.repository.BookingPriceChangeRequestRepository;
import com.homefix.repository.BookingRepository;
import com.homefix.repository.CustomerProfileRepository;
import com.homefix.repository.ServiceCategoryRepository;
import com.homefix.repository.TechnicianProfileRepository;

@ExtendWith(MockitoExtension.class)
class BookingCancellationServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private TechnicianProfileRepository technicianProfileRepository;

    @Mock
    private ServiceCategoryRepository serviceCategoryRepository;

    @Mock
    private BookingPriceChangeRequestRepository priceChangeRepository;

    @Test
    void customerCanCancelRequestedBookingWithReason() {
        Booking booking = bookingForCustomer("customer@example.com", BookingStatus.REQUESTED);
        when(bookingRepository.findByIdAndCustomerUserEmail(41L, "customer@example.com"))
            .thenReturn(Optional.of(booking));
        when(bookingRepository.save(booking)).thenReturn(booking);

        var response = service().cancelCustomerBooking("customer@example.com", 41L, "Plans changed");

        assertEquals("CANCELLED", response.status());
        assertEquals("Plans changed", response.cancellationReason());
    }

    @Test
    void customerCannotCancelBookingAfterWorkHasStarted() {
        Booking booking = bookingForCustomer("customer@example.com", BookingStatus.IN_PROGRESS);
        when(bookingRepository.findByIdAndCustomerUserEmail(41L, "customer@example.com"))
            .thenReturn(Optional.of(booking));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> service().cancelCustomerBooking("customer@example.com", 41L, null));

        assertEquals(409, exception.getStatusCode().value());
    }

    @Test
    void customerCannotCancelAnotherCustomersBooking() {
        when(bookingRepository.findByIdAndCustomerUserEmail(41L, "other@example.com"))
            .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
            () -> service().cancelCustomerBooking("other@example.com", 41L, null));

        assertEquals(404, exception.getStatusCode().value());
    }

    private BookingService service() {
        return new BookingService(bookingRepository, customerProfileRepository, technicianProfileRepository, serviceCategoryRepository, priceChangeRepository);
    }

    private Booking bookingForCustomer(String email, BookingStatus status) {
        User customerUser = new User();
        customerUser.setEmail(email);
        customerUser.setFullName("Customer");
        CustomerProfile customer = new CustomerProfile();
        customer.setUser(customerUser);

        User technicianUser = new User();
        technicianUser.setFullName("Technician");
        TechnicianProfile technician = new TechnicianProfile();
        technician.setUser(technicianUser);

        ServiceCategory category = new ServiceCategory();
        category.setName("Plumbing");

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setTechnician(technician);
        booking.setServiceCategory(category);
        booking.setBookingNumber("HF-BK-0041");
        booking.setProblemDescription("Leaking tap");
        booking.setPreferredDatetime(java.time.LocalDateTime.now().plusDays(1));
        booking.setBookingStatus(status);
        return booking;
    }
}
