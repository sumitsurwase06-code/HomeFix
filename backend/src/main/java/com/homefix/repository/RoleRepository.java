package com.homefix.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homefix.entity.Role;
import com.homefix.model.RoleName;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
