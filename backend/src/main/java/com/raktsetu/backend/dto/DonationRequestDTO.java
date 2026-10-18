package com.raktsetu.backend.dto;

import lombok.Data;

@Data
public class DonationRequestDTO {

    private Long donorId;

    private Long requestId;

    private Integer unitsDonated;

    private Integer quantityMl;

    private String donationDate;

}
