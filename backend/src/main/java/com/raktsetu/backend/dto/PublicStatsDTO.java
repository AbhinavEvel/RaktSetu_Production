package com.raktsetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicStatsDTO {

    private long registeredDonors;

    private long livesSaved;

    private long requestsFulfilled;

}
