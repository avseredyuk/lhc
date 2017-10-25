package com.avseredyuk.service;

import com.avseredyuk.converter.BootupReportConverter;
import com.avseredyuk.converter.PumpActionReportConverter;
import com.avseredyuk.converter.SensorReportConverter;
import com.avseredyuk.dto.HistoryDto;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 10/18/17.
 */
@Service
public class HistoryService {
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final BootupService bootupService;
    private final PumpActionReportConverter pumpActionReportConverter;
    private final SensorReportConverter sensorReportConverter;
    private final BootupReportConverter bootupReportConverter;
    
    public HistoryService(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        PumpActionReportConverter pumpActionReportConverter,
        SensorReportConverter sensorReportConverter,
        BootupReportConverter bootupReportConverter) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.pumpActionReportConverter = pumpActionReportConverter;
        this.sensorReportConverter = sensorReportConverter;
        this.bootupReportConverter = bootupReportConverter;
    }
    
    public HistoryDto getHistory() {
        HistoryDto h = new HistoryDto();
        h.getReports().addAll(sensorReportConverter.toDtoList(sensorReportService.getLastReports()));
        h.getPumps().addAll(pumpActionReportConverter.toDtoList(pumpActionService.getLastReports()));
        h.getBootups().addAll(bootupReportConverter.toDtoList(bootupService.getLastReports()));
        return h;
    }
    
}
