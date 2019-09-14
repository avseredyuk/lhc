package com.avseredyuk.service;

import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceReportDataExclusion;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.DeviceReportDataExclusionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

@Deprecated
@Service
public class DeviceReportDataExclusionService {
    
    private final DeviceReportDataExclusionRepository deviceReportDataExclusionRepository;
    
    @Autowired
    public DeviceReportDataExclusionService(
        DeviceReportDataExclusionRepository deviceReportDataExclusionRepository) {
        this.deviceReportDataExclusionRepository = deviceReportDataExclusionRepository;
    }
    
    @Caching(evict = {
        @CacheEvict(value = "Gauge", allEntries = true),
        @CacheEvict(value = "SensorReport", allEntries = true)
    })
    public DeviceReportDataExclusion save(DeviceReportDataExclusion deviceReportDataExclusion) {
        return deviceReportDataExclusionRepository.save(deviceReportDataExclusion);
    }
    
    public SensorReport filterByDeviceReportDataExclusion(Device device, SensorReport report) {
        return this.filterByDeviceReportDataExclusion(device.getExclusions(), report);
    }
    
    //todo: handle pump exclusion ???
    private SensorReport filterByDeviceReportDataExclusion(List<DeviceReportDataExclusion> mapping, SensorReport report) {
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
                    case ABS_HUMIDITY:
                        report.setAbsoluteHumidity(null);
                        break;
                    default:
                        throw new IllegalArgumentException("Unmapped report data type!");
                }
            }
        );
        return report;
    }
    
    
}
