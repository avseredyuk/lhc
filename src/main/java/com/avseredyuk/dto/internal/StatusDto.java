package com.avseredyuk.dto.internal;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
public class StatusDto {
    
    private List<GaugeDto> gauges;
    private Map<String, List<Long>> lastBootups;
    private Map<String, Long> lastPumps;
    private Map<String, Long> lastReports;
    
    
    @Data
    @Builder
    public static class GaugeDto {
        private String deviceName;
        private String dataType;
        private String value;
    }
}
