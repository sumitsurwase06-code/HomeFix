package com.homefix.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homefix.entity.TechnicianSkill;

public interface TechnicianSkillRepository extends JpaRepository<TechnicianSkill, Long> {
    List<TechnicianSkill> findByTechnicianId(Long technicianId);
}