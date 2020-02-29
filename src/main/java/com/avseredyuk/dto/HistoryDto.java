package com.avseredyuk.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class HistoryDto {
    private String chartName;
    private List<HistoryChartPoint> data;
    private String reportDataType;
    private String color;
    
    @Data
    @AllArgsConstructor
    public static class HistoryChartPoint {
        Object x;
        Object y;
    }
}
