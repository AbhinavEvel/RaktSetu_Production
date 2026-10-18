package com.raktsetu.backend.dto;

import com.raktsetu.backend.enums.Availability;
import com.raktsetu.backend.enums.BloodGroup;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DonorRequest {
	@NotNull(message = "Blood group is required")
	private BloodGroup bloodGroup;

	@Min(value = 18, message = "Donor must be 18 years old")
	private Integer age;

	private String city;
	private String state;
	private String address;
	private Availability isAvailable;
}
