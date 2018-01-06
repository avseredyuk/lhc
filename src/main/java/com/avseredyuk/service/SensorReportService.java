package com.avseredyuk.service;

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
    
    @Autowired
    public SensorReportService(SensorReportRepository sensorReportRepository) {
        this.sensorReportRepository = sensorReportRepository;
    }
    
    @Cacheable("SensorReport")
    public List<SensorReport> getLastReports() {
        return sensorReportRepository.getLastReports();
    }
    
    public SensorReport getLastReport() {
        return sensorReportRepository.getLastReport();
    }
    
    @Caching(evict = {
        @CacheEvict(value = "Gauge", allEntries = true),
        @CacheEvict(value = "SensorReport", allEntries = true)
    })
    public void save(SensorReport report) {
        sensorReportRepository.cleanUp();
        sensorReportRepository.persist(report);
    }
}
