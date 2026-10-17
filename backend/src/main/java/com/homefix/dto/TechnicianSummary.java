package com.homefix.dto;

import java.math.BigDecimal;
import java.util.List;

import com.homefix.entity.TechnicianProfile;

public record TechnicianSummary(
    Long id,
    String name,
    String technicianId,
    int experienceYears,
    double averageRating,
    BigDecimal visitingCharge,
    List<String> skills
) {
    public static TechnicianSummary from(TechnicianProfile profile) {
        return new TechnicianSummary(
            profile.getId(),
            profile.getUser().getFullName(),
            profile.getTechnicianId(),
            profile.getExperienceYears(),
            profile.getAverageRating(),
            profile.getVisitingCharge(),
            profile.getSkills().stream().map(skill -> skill.getSkillName()).toList()
        );
    }
}
