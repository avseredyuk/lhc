package com.avseredyuk.controller;

import com.avseredyuk.mapper.PumpActionReportMapper;
import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.mapper.SensorReportMapper;
import com.avseredyuk.service.BootupService;
import com.avseredyuk.service.ConfigService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.SensorReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lenfer on 10/11/17.
 */
@RestController
public class EspController {
    private static final String AUTH_TOKEN_PARAM_NAME = "AuthToken";
    
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final BootupService bootupService;
    private final ConfigService configService;
    private final PumpActionReportMapper pumpActionReportMapper;
    private final SensorReportMapper sensorReportMapper;
    
    @Autowired
    public EspController(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        ConfigService configService,
        PumpActionReportMapper pumpActionReportMapper,
        SensorReportMapper sensorReportMapper) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.configService = configService;
        this.pumpActionReportMapper = pumpActionReportMapper;
        this.sensorReportMapper = sensorReportMapper;
    }
    
    @RequestMapping(
        value = "/report/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newReport(@RequestBody SensorReportDto reportDto,
                          @RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String authToken) {
        if (configService.getEspAuthToken().equals(authToken)) {
            sensorReportService.save(sensorReportMapper.fromDto(reportDto));
        } else {
            throw new AccessDeniedException();
        }
    }
    
    @RequestMapping(
        value = "/pump/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newPumpAction(@RequestBody PumpActionReportDto actionReportDto,
                              @RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String authToken) {
        if (configService.getEspAuthToken().equals(authToken)) {
            pumpActionService.save(pumpActionReportMapper.fromDto(actionReportDto));
        } else {
            throw new AccessDeniedException();
        }
    }
    
    @RequestMapping(
        value = "/bootup/add",
        method = RequestMethod.POST
    )
    public void newBoot(@RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String authToken) {
        if (configService.getEspAuthToken().equals(authToken)) {
            bootupService.create();
        } else {
            throw new AccessDeniedException();
        }
    }
}
