package com.avseredyuk.dto.internal;

import lombok.Data;

@Data
public class SensorDto {
    private Long id;
    private Long dateTime;
    private Double temperature;
    private Double relhumidity;
    private Double abshumidity;
    private Double watertemperature;
}
