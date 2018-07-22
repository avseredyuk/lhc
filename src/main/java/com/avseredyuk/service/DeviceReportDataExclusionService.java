package com.avseredyuk.service;

import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceReportDataExclusion;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.DeviceReportDataExclusionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 7/22/18.
 */
@Service
public class DeviceReportDataExclusionService {
    
    private final DeviceReportDataExclusionRepository deviceReportDataExclusionRepository;
    
    @Autowired
    public DeviceReportDataExclusionService(
        DeviceReportDataExclusionRepository deviceReportDataExclusionRepository) {
        this.deviceReportDataExclusionRepository = deviceReportDataExclusionRepository;
    }
    
    //todo: refactor this duplication of logic
    
    public SensorReport filterByDeviceReportDataExclusion(Device device, SensorReport report) {
        List<DeviceReportDataExclusion> mapping = deviceReportDataExclusionRepository.findByDeviceId(device.getId());
        mapping.forEach( m -> {
                switch (m.getMap()) {
                    case AIR_TEMP:
                        report.setTemperature(null);
                        break;
                    case HUMIDITY:
                        report.setHumidity(null);
                        break;
                    case WATER_TEMP:
                        report.setWaterTemperature(null);
                        break;
                    default:
                        throw new IllegalArgumentException("Unmapped report data type!");
                }
            }
        );
        return report;
    }
    
    public List<SensorReport> filterByDeviceReportDataExclusion(Device device, List<SensorReport> reports) {
        List<DeviceReportDataExclusion> mapping = deviceReportDataExclusionRepository.findByDeviceId(device.getId());
        mapping.forEach( m -> {
                switch (m.getMap()) {
                    case AIR_TEMP:
                        reports.forEach(r -> r.setTemperature(null));
                        break;
                    case HUMIDITY:
                        reports.forEach(r -> r.setHumidity(null));
                        break;
                    case WATER_TEMP:
                        reports.forEach(r -> r.setWaterTemperature(null));
                        break;
                    default:
                        throw new IllegalArgumentException("Unmapped report data type!");
                }
            }
        );
        return reports;
    }
    
}
