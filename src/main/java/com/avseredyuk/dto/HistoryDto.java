package com.avseredyuk.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

/**
 * Created by lenfer on 10/18/17.
 */
@Data
public class HistoryDto {
    List<BootupReportDto> bootups = new ArrayList<>();
    List<PumpActionReportDto> pumps = new ArrayList<>();
    List<SensorReportDto> reports = new ArrayList<>();
    String uptime;
}
