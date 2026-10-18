package com.raktsetu.backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.raktsetu.backend.enums.Role;
import com.raktsetu.backend.enums.VerificationStatus;

import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.RegisterRequest;
import com.raktsetu.backend.dto.UserResponse;
import com.raktsetu.backend.entity.User;
import com.raktsetu.backend.repository.UserRepository;
import com.raktsetu.backend.dto.AuthResponse;
import com.raktsetu.backend.dto.ChangePasswordRequest;
import com.raktsetu.backend.dto.LoginRequest;
import com.raktsetu.backend.security.JwtUtil;
import com.raktsetu.backend.dto.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import com.raktsetu.backend.exception.BadRequestException;
import com.raktsetu.backend.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final EmailService emailService;

	@Value("${app.frontend.base-url:http://localhost:5173}")
	private String frontendBaseUrl;

	public UserResponse registerUser(RegisterRequest request) {
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("Email already registered!");
		}

		boolean requestingAdmin = "Admin".equalsIgnoreCase(request.getRole());

		if (requestingAdmin) {
			// Bootstrap exception: if the system has no admin at all yet, allow the
			// very first Admin account to be created through this public endpoint.
			// Once an admin exists, this hole closes — further admins must be
			// created by an existing admin via /api/auth/register-admin.
			if (userRepository.existsByRole(Role.Admin)) {
				throw new BadRequestException("Admin accounts can only be created by an existing admin.");
			}
		} else if (!"Donor".equalsIgnoreCase(request.getRole()) && !"Patient".equalsIgnoreCase(request.getRole())) {
			throw new BadRequestException("Invalid role. Only Donor or Patient can self-register.");
		}

		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setPhone(request.getPhone());
		user.setRole(Role.valueOf(request.getRole()));

		// The bootstrap admin doesn't need to wait on itself for verification.
		if (requestingAdmin) {
			user.setIsVerified(VerificationStatus.Accepted);
		}

		User savedUser = userRepository.save(user);

		return mapToResponse(savedUser);
	}

	// An existing admin creates another admin account. Requires an authenticated
	// admin caller — this is how additional admins get added after the first one.
	public UserResponse registerAdmin(String creatorAdminEmail, RegisterRequest request) {
		requireAdmin(creatorAdminEmail);

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("Email already registered!");
		}

		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setPhone(request.getPhone());
		user.setRole(Role.Admin);
		user.setIsVerified(VerificationStatus.Accepted);

		User savedUser = userRepository.save(user);

		return mapToResponse(savedUser);
	}

	// Step 1 of forgot-password: generate a one-time token, store it with a 30-minute
	// expiry, and email a reset link. We don't reveal whether the email exists — the
	// response message is identical either way, to avoid leaking which emails are
	// registered.
	public void forgotPassword(String email) {
		userRepository.findByEmail(email).ifPresent(user -> {
			String token = java.util.UUID.randomUUID().toString();
			user.setResetToken(token);
			user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(30));
			userRepository.save(user);

			String resetLink = frontendBaseUrl + "/reset-password?token=" + token;
			String body = "We received a request to reset your RaktSetu account password.\n\n"
					+ "Click the link below to set a new password. This link expires in 30 minutes:\n"
					+ resetLink + "\n\n"
					+ "If you didn't request this, you can safely ignore this email.";

			emailService.sendAlertEmail(user.getEmail(), "Reset your RaktSetu password", body);
		});
	}

	// Step 2 of forgot-password: validate the token (exists + not expired), set the
	// new password, and invalidate the token so it can't be reused.
	public void resetPassword(ResetPasswordRequest request) {
		User user = userRepository.findByResetToken(request.getToken())
				.orElseThrow(() -> new BadRequestException("Invalid or expired reset link"));

		if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
			throw new BadRequestException("This reset link has expired. Please request a new one.");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		user.setResetToken(null);
		user.setResetTokenExpiry(null);

		userRepository.save(user);
	}

	private UserResponse mapToResponse(User user) {
		return new UserResponse(
				user.getUserId(),
				user.getName(),
				user.getEmail(),
				user.getPhone(),
				user.getRole().name(),
				user.getIsVerified().name()
		);
	}

	public AuthResponse loginUser(LoginRequest request) {
		User user = userRepository.findByEmail(request.getEmail())
					.orElseThrow(() -> new BadRequestException("Invalid email or password"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
	        throw new BadRequestException("Invalid email or password");
	    }

		String token = jwtUtil.generateToken(user.getEmail());

	    UserResponse userResponse = mapToResponse(user);
	    return new AuthResponse(token, userResponse);
	}

	public void changePassword(String email, ChangePasswordRequest request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
			throw new BadRequestException("Current password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);
	}

	// GET /api/auth/me — logged-in user's own details
	public UserResponse getCurrentUser(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return mapToResponse(user);
	}

	// Admin approves a newly registered donor/patient account
	public UserResponse verifyUser(String adminEmail, Long userId) {
		requireAdmin(adminEmail);

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		user.setIsVerified(VerificationStatus.Accepted);

		User saved = userRepository.save(user);

		return mapToResponse(saved);
	}

	// Admin — list all registered users (for verification / oversight)
	public List<UserResponse> getAllUsers(String adminEmail) {
		requireAdmin(adminEmail);

		return userRepository.findAll()
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	private void requireAdmin(String email) {
		User admin = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (admin.getRole() != Role.Admin) {
			throw new BadRequestException("Access denied: Admins only");
		}
	}
}
