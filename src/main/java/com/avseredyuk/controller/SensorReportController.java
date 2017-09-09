package com.avseredyuk.controller;

import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.SensorReportRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lenfer on 9/9/17.
 */
@RestController
public class SensorReportController {
    
    @Autowired
    private SensorReportRepository repository;
    
    @RequestMapping(
        value = "/lastReports",
        method = RequestMethod.GET
    )
    public List<SensorReport> getLastReports() {
        return repository.getLastReports();
    }
    
}
