package com.homefix.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PriceChangeRequestDto(
    @NotNull(message = "Visiting charge is required")
    @DecimalMin(value = "0.00", message = "Visiting charge cannot be negative")
    BigDecimal visitingCharge,

    @NotNull(message = "Labor charge is required")
    @DecimalMin(value = "0.00", message = "Labor charge cannot be negative")
    BigDecimal laborCharge,

    @NotNull(message = "Material charge is required")
    @DecimalMin(value = "0.00", message = "Material charge cannot be negative")
    BigDecimal materialCharge,

    @NotBlank(message = "Reason for price modification is required")
    String reason
) {}
