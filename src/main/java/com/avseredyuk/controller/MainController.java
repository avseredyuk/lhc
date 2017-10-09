package com.avseredyuk.controller;

import com.avseredyuk.converter.BootupReportConverter;
import com.avseredyuk.converter.PumpActionReportConverter;
import com.avseredyuk.converter.SensorReportConverter;
import com.avseredyuk.dto.BootupReportDto;
import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.service.BackupService;
import com.avseredyuk.service.BootupService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.SensorReportService;
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
public class MainController {
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final BootupService bootupService;
    private final BackupService backupService;
    private final PumpActionReportConverter pumpActionReportConverter;
    private final SensorReportConverter sensorReportConverter;
    private final BootupReportConverter bootupReportConverter;
    
    @Value("${esp.auth-token}")
    private String espAuthToken;
    
    @Autowired
    public MainController(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        BackupService backupService,
        PumpActionReportConverter pumpActionReportConverter,
        SensorReportConverter sensorReportConverter,
        BootupReportConverter bootupReportConverter) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.backupService = backupService;
        this.pumpActionReportConverter = pumpActionReportConverter;
        this.sensorReportConverter = sensorReportConverter;
        this.bootupReportConverter = bootupReportConverter;
    }
    
    @RequestMapping(
        value = "/lastReports",
        method = RequestMethod.GET
    )
    public List<SensorReportDto> getLastReports() {
        return sensorReportConverter.toDtoList(sensorReportService.getLastReports());
    }
    
    @RequestMapping(
        value = "/lastPumpActions",
        method = RequestMethod.GET
    )
    public List<PumpActionReportDto> getLastPumpActions() {
        return pumpActionReportConverter.toDtoList(pumpActionService.getLastReports());
    }
    
    @RequestMapping(
        value = "/lastBootups",
        method = RequestMethod.GET
    )
    public List<BootupReportDto> getLastBootups() {
        return bootupReportConverter.toDtoList(bootupService.getLastReports());
    }
    
    @RequestMapping(
        value = "/report",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newReport(@RequestBody SensorReportDto reportDto, @RequestHeader(value = "AuthToken", required = false) String authToken) {
        if (espAuthToken.equals(authToken)) {
            backupService.checkAndBackup();
            sensorReportService.save(sensorReportConverter.fromDto(reportDto));
        } else {
            throw new AccessDeniedException();
        }
    }
    
    @RequestMapping(
        value = "/pump",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newPumpAction(@RequestBody PumpActionReportDto actionReportDto, @RequestHeader(value = "AuthToken", required = false) String authToken) {
        if (espAuthToken.equals(authToken)) {
            pumpActionService.save(pumpActionReportConverter.fromDto(actionReportDto));
        } else {
            throw new AccessDeniedException();
        }
    }
    
    @RequestMapping(
        value = "/bootup",
        method = RequestMethod.POST
    )
    public void newBoot(@RequestHeader(value = "AuthToken", required = false) String authToken) {
        if (espAuthToken.equals(authToken)) {
            bootupService.create();
        } else {
            throw new AccessDeniedException();
        }
    }
    
}
