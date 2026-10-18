package com.raktsetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockSummaryDTO {

    private String bloodGroup;

    private String component;

    private Integer unitsAvailable;

}
