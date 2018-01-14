package com.avseredyuk.service;

import com.avseredyuk.mapper.BootupReportMapper;
import com.avseredyuk.mapper.PumpActionReportMapper;
import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.mapper.SensorReportMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 10/18/17.
 */
@Service
public class HistoryService {
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final BootupService bootupService;
    private final PumpActionReportMapper pumpActionReportMapper;
    private final SensorReportMapper sensorReportMapper;
    private final BootupReportMapper bootupReportMapper;
    
    @Autowired
    public HistoryService(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        PumpActionReportMapper pumpActionReportMapper,
        SensorReportMapper sensorReportMapper,
        BootupReportMapper bootupReportMapper) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.pumpActionReportMapper = pumpActionReportMapper;
        this.sensorReportMapper = sensorReportMapper;
        this.bootupReportMapper = bootupReportMapper;
    }
    
    public HistoryDto getHistory() {
        HistoryDto h = new HistoryDto();
        h.getReports().addAll(sensorReportMapper.toDtoList(sensorReportService.getLastReports()));
        h.getPumps().addAll(pumpActionReportMapper.toDtoList(pumpActionService.getLastReports()));
        h.getBootups().addAll(bootupReportMapper.toDtoList(bootupService.getLastReports()));
        return h;
    }
    
}
