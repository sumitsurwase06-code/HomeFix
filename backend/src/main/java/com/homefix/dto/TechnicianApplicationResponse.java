package com.homefix.dto;

import java.math.BigDecimal;

import com.homefix.entity.TechnicianProfile;

public record TechnicianApplicationResponse(
    Long id,
    String technicianId,
    String name,
    String email,
    String phone,
    String bio,
    int experienceYears,
    BigDecimal visitingCharge,
    String verificationStatus,
    boolean publiclyBookable
) {
    public static TechnicianApplicationResponse from(TechnicianProfile profile) {
        return new TechnicianApplicationResponse(
            profile.getId(),
            profile.getTechnicianId(),
            profile.getUser().getFullName(),
            profile.getUser().getEmail(),
            profile.getUser().getPhone(),
            profile.getBio(),
            profile.getExperienceYears(),
            profile.getVisitingCharge(),
            profile.getVerificationStatus(),
            profile.isPubliclyBookable()
        );
    }
}