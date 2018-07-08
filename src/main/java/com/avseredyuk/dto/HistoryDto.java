package com.avseredyuk.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;

/**
 * Created by lenfer on 10/18/17.
 */
@Data
public class HistoryDto {
    private Map<String, List<BootupReportDto>> bootups = new HashMap<>();
    private Map<String, List<PumpActionReportDto>> pumps = new HashMap<>();
    private Map<String, List<SensorReportDto>> reports = new HashMap<>();
}
