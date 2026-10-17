package com.homefix.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.homefix.entity.TechnicianProfile;

public interface TechnicianProfileRepository extends JpaRepository<TechnicianProfile, Long> {
    Optional<TechnicianProfile> findByUserEmail(String email);
    List<TechnicianProfile> findByVerificationStatusAndPubliclyBookableOrderByAverageRatingDesc(String verificationStatus, boolean publiclyBookable);
    List<TechnicianProfile> findByVerificationStatusOrderByTechnicianIdAsc(String verificationStatus);
    long countByVerificationStatus(String verificationStatus);

    @Query("select distinct profile from TechnicianProfile profile join profile.skills skill "
        + "where profile.verificationStatus = 'VERIFIED' and profile.publiclyBookable = true "
        + "and lower(skill.skillName) like lower(concat('%', :serviceName, '%')) "
        + "order by profile.averageRating desc")
    List<TechnicianProfile> findBookableByServiceSkill(@Param("serviceName") String serviceName);
}
