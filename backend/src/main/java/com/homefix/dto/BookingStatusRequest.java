package com.homefix.dto;

import com.homefix.model.BookingStatus;

import jakarta.validation.constraints.NotNull;

public record BookingStatusRequest(@NotNull BookingStatus status) {
}
