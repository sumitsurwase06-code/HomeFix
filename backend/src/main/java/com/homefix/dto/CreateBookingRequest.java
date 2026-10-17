package com.homefix.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateBookingRequest(
    @Positive long technicianProfileId,
    @Positive long serviceCategoryId,
    @NotBlank @Size(max = 2000) String problemDescription,
    @NotNull @Future LocalDateTime preferredDatetime
) {
}
