package com.homefix.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.homefix.dto.TechnicianApplicationResponse;
import com.homefix.entity.TechnicianProfile;
import com.homefix.entity.User;
import com.homefix.model.VerificationDecision;
import com.homefix.repository.TechnicianProfileRepository;

@ExtendWith(MockitoExtension.class)
class TechnicianVerificationServiceTest {

    @Mock
    private TechnicianProfileRepository technicianProfileRepository;

    @Test
    void approvalMakesPendingTechnicianBookable() {
        TechnicianProfile profile = pendingProfile();
        when(technicianProfileRepository.findById(12L)).thenReturn(Optional.of(profile));
        when(technicianProfileRepository.save(any(TechnicianProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TechnicianApplicationResponse result = new TechnicianVerificationService(technicianProfileRepository)
            .review(12L, VerificationDecision.APPROVE);

        assertEquals("VERIFIED", result.verificationStatus());
        assertTrue(result.publiclyBookable());
    }

    @Test
    void rejectionKeepsTechnicianUnbookable() {
        TechnicianProfile profile = pendingProfile();
        when(technicianProfileRepository.findById(12L)).thenReturn(Optional.of(profile));
        when(technicianProfileRepository.save(any(TechnicianProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TechnicianApplicationResponse result = new TechnicianVerificationService(technicianProfileRepository)
            .review(12L, VerificationDecision.REJECT);

        assertEquals("REJECTED", result.verificationStatus());
        assertFalse(result.publiclyBookable());
    }

    private TechnicianProfile pendingProfile() {
        User user = new User();
        user.setFullName("Test Technician");
        user.setEmail("tech@example.com");
        user.setPhone("9999999999");

        TechnicianProfile profile = new TechnicianProfile();
        profile.setId(12L);
        profile.setTechnicianId("HF-TECH-0012");
        profile.setUser(user);
        return profile;
    }
}