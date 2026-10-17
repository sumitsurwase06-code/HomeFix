package com.homefix.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homefix.dto.TechnicianApplicationResponse;
import com.homefix.entity.TechnicianProfile;
import com.homefix.model.VerificationDecision;
import com.homefix.repository.TechnicianProfileRepository;

@Service
public class TechnicianVerificationService {

    private final TechnicianProfileRepository technicianProfileRepository;

    public TechnicianVerificationService(TechnicianProfileRepository technicianProfileRepository) {
        this.technicianProfileRepository = technicianProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<TechnicianApplicationResponse> pendingApplications() {
        return technicianProfileRepository.findByVerificationStatusOrderByTechnicianIdAsc("PENDING")
            .stream().map(TechnicianApplicationResponse::from).toList();
    }

    @Transactional
    public TechnicianApplicationResponse review(long profileId, VerificationDecision decision) {
        TechnicianProfile profile = technicianProfileRepository.findById(profileId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Technician application not found"));

        if (!"PENDING".equals(profile.getVerificationStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This technician application has already been reviewed");
        }

        boolean approved = decision == VerificationDecision.APPROVE;
        profile.setVerificationStatus(approved ? "VERIFIED" : "REJECTED");
        profile.setPubliclyBookable(approved);
        return TechnicianApplicationResponse.from(technicianProfileRepository.save(profile));
    }
}