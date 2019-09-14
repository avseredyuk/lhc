package com.avseredyuk.dto.internal;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlantMaintenanceWrapperDto {
    private Long deviceId;
    private List<PlantMaintenanceDto> maintenances;
}
