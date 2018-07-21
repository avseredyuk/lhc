package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.SensorReportRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 9/18/17.
 */
@Service
public class SensorReportService {
    private SensorReportRepository sensorReportRepository;
    private ConfigService configService;
    private DeviceService deviceService;
    
    @Autowired
    public SensorReportService(SensorReportRepository sensorReportRepository,
        ConfigService configService, DeviceService deviceService) {
        this.sensorReportRepository = sensorReportRepository;
        this.configService = configService;
        this.deviceService = deviceService;
    }
    
    @Cacheable("SensorReport")
    List<SensorReport> getLastReportsByDevice(Device device) {
        return sensorReportRepository.getLastReports(device.getId(), configService.getHoursCount());
    }
    
    SensorReport getLastReportByDevice(Device device) {
        return sensorReportRepository.getLastReport(device.getId());
    }
    
    @Caching(evict = {
        @CacheEvict(value = "Gauge", allEntries = true),
        @CacheEvict(value = "SensorReport", allEntries = true)
    })
    public void save(SensorReport report) {
        if (deviceService.isTrustedDevice(report.getDevice())) {
            sensorReportRepository.cleanUp(configService.getCleanupIntervalDays());
            report.setDevice(deviceService.findByToken(report.getDevice().getToken()));
            sensorReportRepository.save(report);
        } else {
            throw new AccessDeniedException();
        }
    }
}
