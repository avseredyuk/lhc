package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.EspDevice;
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
    private EspAuthService espAuthService;
    
    @Autowired
    public SensorReportService(SensorReportRepository sensorReportRepository,
        ConfigService configService, EspAuthService espAuthService) {
        this.sensorReportRepository = sensorReportRepository;
        this.configService = configService;
        this.espAuthService = espAuthService;
    }
    
    @Cacheable("SensorReport")
    public List<SensorReport> getLastReports() {
        return sensorReportRepository.getLastReports(configService.getHoursCount());
    }
    
    public SensorReport getLastReport() {
        return sensorReportRepository.getLastReport();
    }
    
    @Caching(evict = {
        @CacheEvict(value = "Gauge", allEntries = true),
        @CacheEvict(value = "SensorReport", allEntries = true)
    })
    public void save(SensorReport report) {
        if (espAuthService.isTrustedDevice(report.getEspDevice())) {
            sensorReportRepository.cleanUp(configService.getCleanupIntervalDays());
            report.setEspDevice(espAuthService.findByToken(report.getEspDevice().getToken()));
            sensorReportRepository.save(report);
        } else {
            throw new AccessDeniedException();
        }
        
    }
}
