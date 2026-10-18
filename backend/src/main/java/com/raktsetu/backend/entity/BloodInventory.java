package com.raktsetu.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.raktsetu.backend.enums.BloodGroup;
import com.raktsetu.backend.enums.BloodGroupConverter;
import com.raktsetu.backend.enums.Component;
import com.raktsetu.backend.enums.InventoryStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "blood_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "bag_number", nullable = false, unique = true, length = 50)
    private String bagNumber;

    @Convert(converter = BloodGroupConverter.class)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "component", nullable = false)
    private Component component;

    @Column(name = "quantity_ml", nullable = false)
    private Integer quantityMl;

    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InventoryStatus status = InventoryStatus.Available;

    @ManyToOne
    @JoinColumn(name = "added_by", nullable = false)
    private User addedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
