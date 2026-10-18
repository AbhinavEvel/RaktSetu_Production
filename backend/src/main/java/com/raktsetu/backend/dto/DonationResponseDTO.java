package com.raktsetu.backend.dto;

import lombok.Data;

@Data
public class DonationResponseDTO {

    private Long donationId;

    private Long donorId;

    private Long requestId;

    private Integer unitsDonated;

    private Integer quantityMl;

    private String donationDate;

    private String status;

}
