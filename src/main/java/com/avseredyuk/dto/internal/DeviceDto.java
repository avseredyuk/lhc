package com.avseredyuk.dto.internal;

import java.util.List;
import lombok.Data;

@Data
public class DeviceDto {
    private long id;
    private String token;
    private String name;
    private boolean enabled;
    private List<DeviceConfigDto> config;
    private List<DeviceReportDataExclusionDto> exclusions;
    
    @Data
    public static class DeviceConfigDto {
        private Long id;
        private String key;
        private String value;
    }
    
    @Data
    public static class DeviceReportDataExclusionDto {
        private String map;
        private boolean isExcluded;
    }
}
