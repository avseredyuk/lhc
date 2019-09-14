package com.avseredyuk.service;

import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.ABS_HUMIDITY;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.AIR_TEMP;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.HUMIDITY;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.PUMP;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.WATER_TEMP;

import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.dto.HistoryDto.HistoryChartPoint;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType;
import com.avseredyuk.model.PumpActionReport.PumpActionType;
import com.avseredyuk.model.SensorReport;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoryService {
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final DeviceService deviceService;
    
    @Autowired
    public HistoryService(SensorReportService sensorReportService,
        PumpActionService pumpActionService, DeviceService deviceService) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.deviceService = deviceService;
    }
    
    public List<HistoryDto> getHistory() {
        List<HistoryDto> result = new ArrayList<>();
        
        List<Device> devices = deviceService.findAllActive();
        for (Device device : devices) {
            result.addAll(getReportDataList(device));
            
            List<ReportDataType> mapping = StatusService.getMappingTypesByDevice(device);
            if (!mapping.contains(PUMP)) {
                result.add(getPumpData(device));
            }
        }
        
        return result;
    }
    
    private List<HistoryDto> getReportDataList(Device device) {
        List<HistoryDto> dtoList = new ArrayList<>();
        List<ReportDataType> mapping = StatusService.getMappingTypesByDevice(device);
        List<SensorReport> reports = sensorReportService.getLastReportsByDevice(device);
        
        if (!mapping.contains(AIR_TEMP)) {
            dtoList.add(HistoryDto
                .builder()
                .chartName(String.format("Temperature (%s)", device.getName()))
                .reportDataType(AIR_TEMP.toString())
                .data(
                    reports
                        .stream()
                        .map(r -> new HistoryChartPoint(r.getDateTime().getTime(), r.getTemperature()))
                        .collect(Collectors.toList())
                )
                .build());
        }
        if (!mapping.contains(WATER_TEMP)) {
            dtoList.add(HistoryDto
                .builder()
                .chartName(String.format("Water Temperature (%s)", device.getName()))
                .reportDataType(WATER_TEMP.toString())
                .data(
                    reports
                        .stream()
                        .map(r -> new HistoryChartPoint(r.getDateTime().getTime(), r.getWaterTemperature()))
                        .collect(Collectors.toList())
                )
                .build());
        }
        if (!mapping.contains(HUMIDITY)) {
            dtoList.add(HistoryDto
                .builder()
                .chartName(String.format("Humidity (%s)",device.getName()))
                .reportDataType(HUMIDITY.toString())
                .data(
                    reports
                        .stream()
                        .map(r -> new HistoryChartPoint(r.getDateTime().getTime(), r.getHumidity()))
                        .collect(Collectors.toList())
                )
                .build());
        }
        if (!mapping.contains(ABS_HUMIDITY)) {
            dtoList.add(HistoryDto
                .builder()
                .chartName(String.format("Abs Humidity (%s)", device.getName()))
                .reportDataType(ABS_HUMIDITY.toString())
                .data(
                    reports
                        .stream()
                        .map(r -> new HistoryChartPoint(r.getDateTime().getTime(), r.getAbsoluteHumidity()))
                        .collect(Collectors.toList())
                )
                .build());
        }
        return dtoList;
    }
    
    private HistoryDto getPumpData(Device device) {
        return HistoryDto
            .builder()
            .chartName(String.format("Pump (%s)", device.getName()))
            .reportDataType(PUMP.toString())
            .data(pumpActionService.getLastReportsByDevice(device)
                .stream()
                .map(r -> new HistoryChartPoint(r.getDateTime().getTime(), mapPumpActionType(r.getActionType())))
                .collect(Collectors.toList())
            )
            .build();
    }
    
    private static int mapPumpActionType(PumpActionType actionType) {
        return actionType == PumpActionType.ENABLED ? 1 : 0;
    }
    
}
