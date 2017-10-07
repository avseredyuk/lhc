package com.avseredyuk.service;

import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.SensorReportRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    public List<SensorReport> getLastReports() {
        return sensorReportRepository.getLastReports();
    }
    
    public void save(SensorReport report) {
        sensorReportRepository.persist(report);
    }
}
