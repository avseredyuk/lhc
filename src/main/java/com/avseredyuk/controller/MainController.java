package com.avseredyuk.controller;

import com.avseredyuk.converter.PumpActionReportConverter;
import com.avseredyuk.converter.SensorReportConverter;
import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.service.BackupService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.SensorReportService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lenfer on 9/9/17.
 */
@RestController
public class MainController {
    private SensorReportService sensorReportService;
    private PumpActionService pumpActionService;
    private BackupService backupService;
    private PumpActionReportConverter pumpActionReportConverter;
    private SensorReportConverter sensorReportConverter;
    
    @Value("${esp.auth-token}")
    private String espAuthToken;
    
    @Autowired
    public MainController(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BackupService backupService,
        PumpActionReportConverter pumpActionReportConverter,
        SensorReportConverter sensorReportConverter) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.backupService = backupService;
        this.pumpActionReportConverter = pumpActionReportConverter;
        this.sensorReportConverter = sensorReportConverter;
    }
    
    @RequestMapping(
        value = "/lastReports",
        method = RequestMethod.GET
    )
    public List<SensorReportDto> getLastReports(@RequestParam(name="tz", defaultValue = "-180") Integer tzOffset) {
        return sensorReportConverter.toDtoList(sensorReportService.getLastReports(tzOffset));
    }
    
    @RequestMapping(
        value = "/report",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newReport(@RequestBody SensorReport report, @RequestHeader(value = "AuthToken", required = false) String authToken) {
        if (espAuthToken.equals(authToken)) {
            backupService.checkAndBackup();
            sensorReportService.save(report);
        } else {
            throw new AccessDeniedException();
        }
    }
    
    @RequestMapping(
        value = "/lastPumpActions",
        method = RequestMethod.GET
    )
    public List<PumpActionReportDto> getLastPumpActions(@RequestParam(name="tz", defaultValue = "-180") Integer tzOffset) {
        return pumpActionReportConverter.toDtoList(pumpActionService.getLastReports(tzOffset));
    }
    
    @RequestMapping(
        value = "/pump",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newPumpAction(@RequestBody PumpActionReport actionReport, @RequestHeader(value = "AuthToken", required = false) String authToken) {
        if (espAuthToken.equals(authToken)) {
            pumpActionService.save(actionReport);
        } else {
            throw new AccessDeniedException();
        }
    }
    
}
