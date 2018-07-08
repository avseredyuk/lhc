package com.avseredyuk.service;

import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.mapper.BootupReportMapper;
import com.avseredyuk.mapper.PumpActionReportMapper;
import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.mapper.SensorReportMapper;
import com.avseredyuk.model.SensorReport;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
        h.setReports(sensorReportService.getLastReports()
            .stream()
            .collect(
                Collectors.groupingBy(r -> r.getEspDevice().getName())
            )
            .entrySet()
            .stream()
            .collect(
                Collectors.toMap(Map.Entry::getKey,
                    e -> sensorReportMapper.toDtoList(e.getValue()))
            )
        );
        h.setPumps(
            pumpActionService.getLastReports()
                .stream()
                .collect(
                    Collectors.groupingBy(r -> r.getEspDevice().getName())
                )
                .entrySet()
                .stream()
                .collect(
                    Collectors.toMap(Map.Entry::getKey,
                        e -> pumpActionReportMapper.toDtoList(e.getValue()))
                )
        );
        h.setBootups(
            bootupService.getLastReports()
                .stream()
                .collect(
                    Collectors.groupingBy(r -> r.getEspDevice().getName())
                )
                .entrySet()
                .stream()
                .collect(
                    Collectors.toMap(Map.Entry::getKey,
                        e -> bootupReportMapper.toDtoList(e.getValue()))
                )
        );
        return h;
    }
    
}
