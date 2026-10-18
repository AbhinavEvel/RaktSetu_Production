package com.raktsetu.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
	@NotBlank(message = "Email is required")
	@Email(message = "Invaild email format")
	private String email;

	@NotBlank(message = "Password is Required")
	private String password;
}
