package com.raktsetu.backend.entity;


import com.raktsetu.backend.enums.BloodGroup;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patientId;

    // One-to-One with User table
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true, nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group_needed", nullable = false)
    private BloodGroup  bloodGroupNeeded;

    private Integer age;

    private String city;

    private String state;

    @Column(columnDefinition = "TEXT")
    private String address;
}
