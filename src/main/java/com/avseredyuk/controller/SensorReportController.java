package com.avseredyuk.controller;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.SensorReportRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
    
    @Value("${esp.auth-token}")
    private String espAuthToken;
    
    @RequestMapping(
        value = "/lastReports",
        method = RequestMethod.GET
    )
    public List<SensorReport> getLastReports() {
        return repository.getLastReports();
    }
    
    @RequestMapping(
        value = "/report",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newReport(@RequestBody SensorReport report, @RequestHeader(value = "AuthToken", required = false) String authToken) {
        if (espAuthToken.equals(authToken)) {
            repository.persist(report);
        } else {
            throw new AccessDeniedException();
        }
    }
    
}
