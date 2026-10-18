package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raktsetu.backend.dto.AuthResponse;
import com.raktsetu.backend.dto.ChangePasswordRequest;
import com.raktsetu.backend.dto.ForgotPasswordRequest;
import com.raktsetu.backend.dto.ResetPasswordRequest;
import com.raktsetu.backend.dto.LoginRequest;
import com.raktsetu.backend.dto.RegisterRequest;
import com.raktsetu.backend.dto.UserResponse;
import com.raktsetu.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final UserService userService;

	@PostMapping("/register")
	public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
		UserResponse response = userService.registerUser(request);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	// An existing admin creates another admin account
	@PostMapping("/register-admin")
	public ResponseEntity<UserResponse> registerAdmin(@Valid @RequestBody RegisterRequest request,
			Authentication authentication){
		String creatorAdminEmail = authentication.getName();
		UserResponse response = userService.registerAdmin(creatorAdminEmail, request);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
	    System.out.println("LOGIN METHOD CALLED - Email: " + request.getEmail());
	    AuthResponse response = userService.loginUser(request);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
		userService.forgotPassword(request.getEmail());
		return new ResponseEntity<>(
			"If an account exists for this email, a password reset link has been sent.",
			HttpStatus.OK
		);
	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request){
		userService.resetPassword(request);
		return new ResponseEntity<>("Password reset successfully", HttpStatus.OK);
	}

	@PutMapping("/change-password")
	public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request,
			Authentication authentication){
		String email = authentication.getName();
		userService.changePassword(email, request);
		return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
	}

	@GetMapping("/me")
	public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication){
		String email = authentication.getName();
		UserResponse response = userService.getCurrentUser(email);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// Admin approves a newly registered donor/patient account
	@PutMapping("/verify/{userId}")
	public ResponseEntity<UserResponse> verifyUser(@PathVariable Long userId, Authentication authentication){
		String adminEmail = authentication.getName();
		UserResponse response = userService.verifyUser(adminEmail, userId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// Admin — list all registered users (to decide who needs verification)
	@GetMapping("/users")
	public ResponseEntity<List<UserResponse>> getAllUsers(Authentication authentication){
		String adminEmail = authentication.getName();
		return new ResponseEntity<>(userService.getAllUsers(adminEmail), HttpStatus.OK);
	}
}
