package com.homefix.dto;

import com.homefix.model.VerificationDecision;

import jakarta.validation.constraints.NotNull;

public record ReviewTechnicianRequest(@NotNull VerificationDecision decision) {
}