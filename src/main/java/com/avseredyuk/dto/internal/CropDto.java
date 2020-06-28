package com.avseredyuk.dto.internal;

import lombok.Data;

@Data
public class CropDto {
    private Long id;
    private Double weight;
    private Double count;
    private Long d;
    private Long seasonId;
}
