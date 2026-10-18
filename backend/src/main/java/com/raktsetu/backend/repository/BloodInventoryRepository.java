package com.raktsetu.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.raktsetu.backend.entity.BloodInventory;
import com.raktsetu.backend.enums.InventoryStatus;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {

    List<BloodInventory> findByStatus(InventoryStatus status);

    List<BloodInventory> findByStatusAndExpiryDateLessThanEqual(
            InventoryStatus status,
            LocalDate thresholdDate
    );

    List<BloodInventory> findByStatusAndExpiryDateBefore(
            InventoryStatus status,
            LocalDate date
    );

    boolean existsByBagNumber(String bagNumber);
}
