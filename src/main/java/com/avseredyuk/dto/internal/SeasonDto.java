package com.avseredyuk.dto.internal;

import java.util.List;

import lombok.Data;

@Data
public class SeasonDto {
    private Long id;
    private String name;
    private Long deviceId;
    private List<CropDto> crops;
}
