package com.avseredyuk.service;

import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.ABS_HUMIDITY;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.AIR_TEMP;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.HUMIDITY;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.PUMP;
import static com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType.WATER_TEMP;

import com.avseredyuk.dto.internal.StatusDto;
import com.avseredyuk.dto.internal.StatusDto.GaugeDto;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceReportDataExclusion;
import com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.model.SensorReport;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatusService {
    
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private SensorReportService sensorReportService;
    @Autowired
    private BootupService bootupService;
    @Autowired
    private PumpActionService pumpActionService;
    
    public StatusDto getStatus() {
        StatusDto statusDto = new StatusDto();
        
        List<Device> activeDevices = deviceService.findAllActive();
    
        statusDto.setGauges(activeDevices.stream()
            .map(sensorReportService::getLastReportByDevice)
            .filter(Objects::nonNull)
            .map(report -> {
                Device device = report.getDevice();
                List<ReportDataType> mapping = getMappingTypesByDevice(device);
    
                List<StatusDto.GaugeDto> result = new ArrayList<>();
    
                if (!mapping.contains(AIR_TEMP)) {
                    result.add(
                        GaugeDto.builder()
                            .deviceName(device.getName())
                            .dataType(AIR_TEMP.toString())
                            .value(String.valueOf(report.getTemperature()))
                            .build());
                }
                if (!mapping.contains(WATER_TEMP)) {
                    result.add(
                        GaugeDto.builder()
                            .deviceName(device.getName())
                            .dataType(WATER_TEMP.toString())
                            .value(String.valueOf(report.getWaterTemperature()))
                            .build());
                }
                if (!mapping.contains(HUMIDITY)) {
                    result.add(
                        GaugeDto.builder()
                            .deviceName(device.getName())
                            .dataType(HUMIDITY.toString())
                            .value(String.valueOf(report.getHumidity()))
                            .build());
                }
                if (!mapping.contains(ABS_HUMIDITY)) {
                    result.add(
                        GaugeDto.builder()
                            .deviceName(device.getName())
                            .dataType(ABS_HUMIDITY.toString())
                            .value(String.valueOf(report.getAbsoluteHumidity()))
                            .build());
                }
                return result.stream();
            })
            .flatMap(d -> d)
            .collect(Collectors.toList())
        );
        
        Map<String, List<Long>> bootups = new HashMap<>();
        activeDevices.forEach(d -> {
            List<BootupReport> bootupReports = bootupService.getLastReportsByDevice(d);
            if (bootupReports.size() > 0) {
                bootups.put(d.getName(),
                    bootupReports
                        .stream()
                        .map(BootupReport::getDateTime)
                        .map(Date::getTime)
                        .collect(Collectors.toList())
                );
            }
        });
        statusDto.setLastBootups(bootups);
    
        Map<String, Long> pumps = new HashMap<>();
        activeDevices.forEach(d -> {
            List<ReportDataType> mapping = getMappingTypesByDevice(d);
            if (!mapping.contains(PUMP)) {
                PumpActionReport pumpActionReport = pumpActionService.getLastReportByDevice(d);
                if (pumpActionReport != null) {
                    pumps.put(d.getName(),
                        pumpActionReport.getDateTime().getTime()
                    );
                }
            }
        });
        statusDto.setLastPumps(pumps);
    
        Map<String, Long> reports = new HashMap<>();
        activeDevices.forEach(d -> {
            SensorReport sensorReport = sensorReportService.getLastReportByDevice(d);
            if (sensorReport != null) {
                reports.put(d.getName(),
                    sensorReport.getDateTime().getTime()
                );
            }
        });
        statusDto.setLastReports(reports);
        
        return statusDto;
    }
    
    public static List<ReportDataType> getMappingTypesByDevice(Device d) {
        return d.getExclusions()
            .stream()
            .map(DeviceReportDataExclusion::getMap)
            .collect(Collectors.toList());
    }
}
