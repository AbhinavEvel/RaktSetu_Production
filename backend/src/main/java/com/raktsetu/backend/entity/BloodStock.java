package com.raktsetu.backend.entity;

import com.raktsetu.backend.enums.BloodGroup;
import com.raktsetu.backend.enums.Component;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_stock",
       uniqueConstraints = @UniqueConstraint(columnNames = {"bloodGroup", "component"}))
public class BloodStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;

    @Enumerated(EnumType.STRING)
    private Component component;

    private Integer unitsAvailable = 0;

    private LocalDateTime lastUpdated;

    @PreUpdate
    public void setLastUpdated() {
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getStockId() { return stockId; }
    public void setStockId(Long stockId) { this.stockId = stockId; }

    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }

    public Component getComponent() { return component; }
    public void setComponent(Component component) { this.component = component; }

    public Integer getUnitsAvailable() { return unitsAvailable; }
    public void setUnitsAvailable(Integer unitsAvailable) { this.unitsAvailable = unitsAvailable; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
