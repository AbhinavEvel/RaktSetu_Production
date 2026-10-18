package com.raktsetu.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.raktsetu.backend.entity.BloodStock;
import com.raktsetu.backend.enums.BloodGroup;
import com.raktsetu.backend.enums.Component;

public interface BloodStockRepository extends JpaRepository<BloodStock, Long> {
    Optional<BloodStock> findByBloodGroupAndComponent(BloodGroup bloodGroup, Component component);
    List<BloodStock> findByUnitsAvailableLessThan(int threshold);
}
