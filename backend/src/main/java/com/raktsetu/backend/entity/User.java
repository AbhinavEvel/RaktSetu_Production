package com.raktsetu.backend.entity;

import java.sql.Timestamp;

import com.raktsetu.backend.enums.Role;
import com.raktsetu.backend.enums.VerificationStatus;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="user_id")
	private Long userId;

	@Column(nullable = false, length = 50)
	private String name;

	@Column(nullable = false, unique = true, length = 40)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(length = 15)
	private String phone;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;

	@Enumerated(EnumType.STRING)
	@Column(name = "is_verified")
	private VerificationStatus isVerified = VerificationStatus.Pending;

	@Column(name = "created_at", insertable = false, updatable = false)
	private Timestamp createdAt;

	// Used only during a forgot-password flow: a random token emailed to the user,
	// valid for a short window. Both are cleared once the password is reset.
	@Column(name = "reset_token")
	private String resetToken;

	@Column(name = "reset_token_expiry")
	private java.time.LocalDateTime resetTokenExpiry;

}
