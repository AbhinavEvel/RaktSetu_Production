package com.raktsetu.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BloodGroup{
	A_POS("A+"), A_NEG("A-"), AB_POS("AB+"), AB_NEG("AB-"),
	B_POS("B+"), B_NEG("B-"), O_POS("O+"), O_NEG("O-");

	private final String label;

	BloodGroup(String label){
		this.label = label;
	}

	// Whenever a BloodGroup field is serialized to JSON, always output the
	// human-readable label ("A+") instead of the enum constant name ("A_POS").
	@JsonValue
	public String getLabel() {
		return label;
	}

	// Whenever a BloodGroup field is deserialized from JSON, accept either the
	// label ("A+") or the enum constant name ("A_POS"), case-insensitive. This
	// keeps every form/Postman call working regardless of which format is sent.
	@JsonCreator
	public static BloodGroup fromValue(String value) {
		if (value == null) return null;
		String normalized = value.trim();
		for (BloodGroup bg : values()) {
			if (bg.label.equalsIgnoreCase(normalized) || bg.name().equalsIgnoreCase(normalized)) {
				return bg;
			}
		}
		throw new IllegalArgumentException("Unknown blood group: " + value);
	}
}
