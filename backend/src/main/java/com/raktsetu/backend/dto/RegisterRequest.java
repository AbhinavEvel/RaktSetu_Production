package com.raktsetu.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
	@NotBlank(message = "Name is required")
	@Size(max = 50, message = "Name must be under 50 characters")
	private String name;

	@NotBlank(message = "Email is required")
	@Email(message = "Invaild email format")
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 6, message = "Password must be atleast 6 characters")
	private String password;

	@Pattern(regexp = "^[6-9][0-9]{9}$", message = "Enter a valid 10-digit phone number")
	private String phone;

	@NotBlank(message = "Role is required")
	private String role;
}
