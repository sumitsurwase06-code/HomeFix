package com.homefix.service;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homefix.dto.AuthResponse;
import com.homefix.dto.LoginRequest;
import com.homefix.dto.RegisterRequest;
import com.homefix.entity.Role;
import com.homefix.entity.User;
import com.homefix.entity.CustomerProfile;
import com.homefix.entity.TechnicianProfile;
import com.homefix.entity.TechnicianSkill;
import com.homefix.model.RoleName;
import com.homefix.repository.CustomerProfileRepository;
import com.homefix.repository.RoleRepository;
import com.homefix.repository.TechnicianProfileRepository;
import com.homefix.repository.TechnicianSkillRepository;
import com.homefix.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerProfileRepository customerProfileRepository;
    private final TechnicianProfileRepository technicianProfileRepository;
    private final TechnicianSkillRepository technicianSkillRepository;

    public AuthService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder,
        CustomerProfileRepository customerProfileRepository,
        TechnicianProfileRepository technicianProfileRepository,
        TechnicianSkillRepository technicianSkillRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerProfileRepository = customerProfileRepository;
        this.technicianProfileRepository = technicianProfileRepository;
        this.technicianSkillRepository = technicianSkillRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Email already registered");
        }

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(request.getRole().trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role provided");
        }
        if (roleName == RoleName.ADMIN) {
            throw new IllegalArgumentException("Administrator accounts cannot be created through public registration");
        }

        Set<String> skillNames = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        if (roleName == RoleName.TECHNICIAN && request.getSkills() != null) {
            for (String skill : request.getSkills()) {
                if (skill != null && !skill.isBlank()) {
                    skillNames.add(skill.trim());
                }
            }
        }
        if (roleName == RoleName.TECHNICIAN && skillNames.isEmpty()) {
            throw new IllegalArgumentException("Select at least one technician skill");
        }

        Role role = roleRepository.findByName(roleName)
            .orElseGet(() -> roleRepository.save(new Role(roleName, roleName.name() + " role")));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase(Locale.ROOT));
        user.setPhone(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(role));

        userRepository.save(user);

        if (roleName == RoleName.CUSTOMER) {
            CustomerProfile profile = new CustomerProfile();
            profile.setUser(user);
            customerProfileRepository.save(profile);
        } else if (roleName == RoleName.TECHNICIAN) {
            TechnicianProfile profile = new TechnicianProfile();
            profile.setUser(user);
            profile.setTechnicianId("HF-TECH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT));
            TechnicianProfile savedProfile = technicianProfileRepository.save(profile);
            List<TechnicianSkill> skills = new java.util.ArrayList<>();
            for (String skillName : skillNames) {
                TechnicianSkill skill = new TechnicianSkill();
                skill.setTechnician(savedProfile);
                skill.setSkillName(skillName);
                skills.add(skill);
            }
            technicianSkillRepository.saveAll(skills);
        }

        return new AuthResponse("Registration successful", user.getEmail(), List.of(role.getName().name()));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase(Locale.ROOT))
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        List<String> roles = user.getRoles().stream()
            .map(role -> role.getName().name())
            .toList();

        return new AuthResponse("Login successful", user.getEmail(), roles);
    }
}
