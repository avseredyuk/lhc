package com.avseredyuk.dto.internal;

import java.util.List;
import lombok.Data;

@Data
public class PlantMaintenanceDto {
    private Long id;
    private Long deviceId;
    private Long d;
    private String maintenanceType;
    private Double ph;
    private Double tds;
    List<PlantMaintenanceDetailDto> details;
}
