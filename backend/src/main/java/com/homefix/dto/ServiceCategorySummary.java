package com.homefix.dto;

import com.homefix.entity.ServiceCategory;

public record ServiceCategorySummary(Long id, String name, String description) {
    public static ServiceCategorySummary from(ServiceCategory category) {
        return new ServiceCategorySummary(category.getId(), category.getName(), category.getDescription());
    }
}
