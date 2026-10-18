package com.raktsetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyDonationDTO {

    private String month;

    private Long totalDonations;

    private Integer totalUnits;

}
