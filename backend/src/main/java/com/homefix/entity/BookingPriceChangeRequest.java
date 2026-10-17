package com.homefix.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = "booking_price_change_requests")
public class BookingPriceChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private TechnicianProfile technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerProfile customer;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalVisitingCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalLaborCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalMaterialCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalCustomerTotal = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal proposedVisitingCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal proposedLaborCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal proposedMaterialCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal proposedCustomerTotal = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal proposedPlatformFee = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal proposedTechnicianPayout = BigDecimal.ZERO;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String technicianReason;

    @Column(columnDefinition = "TEXT")
    private String customerRejectionReason;

    @Column(nullable = false, length = 40)
    private String status = "PENDING_CUSTOMER_APPROVAL";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    private LocalDateTime decidedAt;

    @Version
    private Long version = 0L;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public TechnicianProfile getTechnician() { return technician; }
    public void setTechnician(TechnicianProfile technician) { this.technician = technician; }
    public CustomerProfile getCustomer() { return customer; }
    public void setCustomer(CustomerProfile customer) { this.customer = customer; }

    public BigDecimal getOriginalVisitingCharge() { return originalVisitingCharge; }
    public void setOriginalVisitingCharge(BigDecimal originalVisitingCharge) { this.originalVisitingCharge = originalVisitingCharge; }
    public BigDecimal getOriginalLaborCharge() { return originalLaborCharge; }
    public void setOriginalLaborCharge(BigDecimal originalLaborCharge) { this.originalLaborCharge = originalLaborCharge; }
    public BigDecimal getOriginalMaterialCharge() { return originalMaterialCharge; }
    public void setOriginalMaterialCharge(BigDecimal originalMaterialCharge) { this.originalMaterialCharge = originalMaterialCharge; }
    public BigDecimal getOriginalCustomerTotal() { return originalCustomerTotal; }
    public void setOriginalCustomerTotal(BigDecimal originalCustomerTotal) { this.originalCustomerTotal = originalCustomerTotal; }

    public BigDecimal getProposedVisitingCharge() { return proposedVisitingCharge; }
    public void setProposedVisitingCharge(BigDecimal proposedVisitingCharge) { this.proposedVisitingCharge = proposedVisitingCharge; }
    public BigDecimal getProposedLaborCharge() { return proposedLaborCharge; }
    public void setProposedLaborCharge(BigDecimal proposedLaborCharge) { this.proposedLaborCharge = proposedLaborCharge; }
    public BigDecimal getProposedMaterialCharge() { return proposedMaterialCharge; }
    public void setProposedMaterialCharge(BigDecimal proposedMaterialCharge) { this.proposedMaterialCharge = proposedMaterialCharge; }
    public BigDecimal getProposedCustomerTotal() { return proposedCustomerTotal; }
    public void setProposedCustomerTotal(BigDecimal proposedCustomerTotal) { this.proposedCustomerTotal = proposedCustomerTotal; }

    public BigDecimal getProposedPlatformFee() { return proposedPlatformFee; }
    public void setProposedPlatformFee(BigDecimal proposedPlatformFee) { this.proposedPlatformFee = proposedPlatformFee; }
    public BigDecimal getProposedTechnicianPayout() { return proposedTechnicianPayout; }
    public void setProposedTechnicianPayout(BigDecimal proposedTechnicianPayout) { this.proposedTechnicianPayout = proposedTechnicianPayout; }

    public String getTechnicianReason() { return technicianReason; }
    public void setTechnicianReason(String technicianReason) { this.technicianReason = technicianReason; }
    public String getCustomerRejectionReason() { return customerRejectionReason; }
    public void setCustomerRejectionReason(String customerRejectionReason) { this.customerRejectionReason = customerRejectionReason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getDecidedAt() { return decidedAt; }
    public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
