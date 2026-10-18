package com.raktsetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
	private Long userId;
	private String name;
	private String email;
	private String phone;
	private String role;
	private String isVerified;
}
