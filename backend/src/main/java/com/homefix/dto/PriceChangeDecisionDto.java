package com.homefix.dto;

public record PriceChangeDecisionDto(
    String rejectionReason
) {
    public String reason() {
        return rejectionReason;
    }
}
