package com.raktsetu.backend.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BloodGroupConverter implements AttributeConverter<BloodGroup, String> {

    @Override
    public String convertToDatabaseColumn(BloodGroup bloodGroup) {
        if (bloodGroup == null) return null;
        return bloodGroup.getLabel();
    }

    @Override
    public BloodGroup convertToEntityAttribute(String dbValue) {
        if (dbValue == null) return null;
        for (BloodGroup bg : BloodGroup.values()) {
            if (bg.getLabel().equals(dbValue)) {
                return bg;
            }
        }
        throw new IllegalArgumentException("Unknown blood group: " + dbValue);
    }
}
