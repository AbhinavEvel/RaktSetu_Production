package com.raktsetu.backend.entity;

import java.time.LocalDate;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.raktsetu.backend.enums.Availability;
import com.raktsetu.backend.enums.BloodGroup;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "donors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "donor_id")
	private Long donorId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "blood_group", nullable = false)
	private BloodGroup bloodGroup;

	@Column
	@JdbcTypeCode(SqlTypes.TINYINT)
	private Integer age;

	@Column(length = 50)
	private String city;

	@Column(length = 40)
	private String state;

	@Column(columnDefinition = "TEXT")
	private String address;

	@Enumerated(EnumType.STRING)
	@Column(name = "is_available")
	private Availability isAvailable = Availability.Yes;

	@Column(name = "last_donation_date")
	private LocalDate lastDonationDate;

}
