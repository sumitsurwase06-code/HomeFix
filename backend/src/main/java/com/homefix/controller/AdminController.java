package com.homefix.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.homefix.dto.AdminDashboardResponse;
import com.homefix.dto.ReviewTechnicianRequest;
import com.homefix.dto.TechnicianApplicationResponse;
import com.homefix.service.AdminDashboardService;
import com.homefix.service.TechnicianVerificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminDashboardService dashboardService;
    private final TechnicianVerificationService verificationService;

    public AdminController(AdminDashboardService dashboardService, TechnicianVerificationService verificationService) {
        this.dashboardService = dashboardService;
        this.verificationService = verificationService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return dashboardService.getDashboard();
    }

    @GetMapping("/technicians/pending")
    public List<TechnicianApplicationResponse> pendingTechnicians() {
        return verificationService.pendingApplications();
    }

    @PatchMapping("/technicians/{profileId}/verification")
    @ResponseStatus(HttpStatus.OK)
    public TechnicianApplicationResponse reviewTechnician(
        @PathVariable long profileId,
        @Valid @RequestBody ReviewTechnicianRequest request
    ) {
        return verificationService.review(profileId, request.decision());
    }
}
