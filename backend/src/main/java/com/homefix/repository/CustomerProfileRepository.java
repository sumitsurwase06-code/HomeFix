package com.homefix.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homefix.entity.CustomerProfile;

public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {
    Optional<CustomerProfile> findByUserEmail(String email);
}
