package com.avseredyuk.dto.internal;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
public class SeasonDto {
    private Long id;
    private String name;
    private Long deviceId;
    private List<CropDto> crops;

    @Data
    @Builder
    public static class SeasonStatisticsDto {
        private Long totalCount;
        private Double totalWeight;
        private Double avgCropWeight;
    }
}
