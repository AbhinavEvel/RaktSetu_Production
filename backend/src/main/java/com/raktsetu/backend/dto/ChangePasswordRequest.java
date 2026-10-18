package com.raktsetu.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
	@NotBlank(message = "Current password is Required")
	private String currentPassword;

	@NotBlank(message = "New password is required")
	@Size(min = 6, message = "New password must be atleast 6 characters")
	private String newPassword;
}
