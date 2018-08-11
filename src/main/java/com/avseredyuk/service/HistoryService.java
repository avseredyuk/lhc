package com.avseredyuk.service;

import com.avseredyuk.mapper.BootupReportMapper;
import com.avseredyuk.mapper.PumpActionReportMapper;
import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.mapper.SensorReportMapper;
import com.avseredyuk.model.Device;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final DeviceService deviceService;
    private final DeviceReportDataExclusionService deviceReportDataExclusionService;
    
    @Autowired
    public HistoryService(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        PumpActionReportMapper pumpActionReportMapper,
        SensorReportMapper sensorReportMapper, BootupReportMapper bootupReportMapper,
        DeviceService deviceService, DeviceReportDataExclusionService deviceReportDataExclusionService) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.pumpActionReportMapper = pumpActionReportMapper;
        this.sensorReportMapper = sensorReportMapper;
        this.bootupReportMapper = bootupReportMapper;
        this.deviceService = deviceService;
        this.deviceReportDataExclusionService = deviceReportDataExclusionService;
    }
    
    public Map<String, HistoryDto> getHistory() {
        Map<String, HistoryDto> history = new HashMap<>();
        List<Device> devices = deviceService.findAllActive();
        for (Device device : devices) {
            HistoryDto dto = new HistoryDto();
            dto.setReports(sensorReportMapper.toDtoStrippedList(
                deviceReportDataExclusionService.filterByDeviceReportDataExclusion(device, sensorReportService.getLastReportsByDevice(device))));
            dto.setPumps(pumpActionReportMapper.toDtoList(pumpActionService.getLastReportsByDevice(device)));
            dto.setBootups(bootupReportMapper.toDtoList(bootupService.getLastReportsByDevice(device)));
            history.put(device.getName(), dto);
        }
        return history;
    }
    
}
