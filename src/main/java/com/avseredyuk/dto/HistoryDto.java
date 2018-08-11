package com.avseredyuk.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.Data;

/**
 * Created by lenfer on 10/18/17.
 */
@Data
public class HistoryDto {
    private List<BootupReportDto> bootups = new ArrayList<>();
    private List<PumpActionReportDto> pumps = new ArrayList<>();
    private List<Map<String, Number>> reports = new ArrayList<>();
}
