package com.avseredyuk.dto.internal;

import java.util.List;
import lombok.Data;

@Data
public class DeviceDto {
    private long id;
    private String token;
    private String name;
    private boolean enabled;
    private String notes;
    private String privateName;
    private List<DeviceConfigDto> config;
    private List<DeviceReportDataExclusionDto> exclusions;
    
    @Data
    public static class DeviceConfigDto {
        private Long id;
        private String key;
        private String value;
        private String type;
    }
    
    @Data
    public static class DeviceReportDataExclusionDto {
        private String map;
    }
}
