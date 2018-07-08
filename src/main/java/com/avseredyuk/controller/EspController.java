package com.avseredyuk.controller;

import com.avseredyuk.mapper.EspDeviceMapper;
import com.avseredyuk.mapper.PumpActionReportMapper;
import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.mapper.SensorReportMapper;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.EspDevice;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.service.BootupService;
import com.avseredyuk.service.ConfigService;
import com.avseredyuk.service.EspAuthService;
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
    private final PumpActionReportMapper pumpActionReportMapper;
    private final SensorReportMapper sensorReportMapper;
    private final EspDeviceMapper espDeviceMapper;
    
    @Autowired
    public EspController(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        PumpActionReportMapper pumpActionReportMapper, SensorReportMapper sensorReportMapper,
        EspDeviceMapper espDeviceMapper) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.pumpActionReportMapper = pumpActionReportMapper;
        this.sensorReportMapper = sensorReportMapper;
        this.espDeviceMapper = espDeviceMapper;
    }
    
    @RequestMapping(
        value = "/report/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newReport(@RequestBody SensorReportDto reportDto,
                          @RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String authToken) {
        SensorReport report = sensorReportMapper.fromDto(reportDto);
        report.setEspDevice(espDeviceMapper.toModel(authToken));
        sensorReportService.save(report);
    }
    
    @RequestMapping(
        value = "/pump/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newPumpAction(@RequestBody PumpActionReportDto actionReportDto,
                              @RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String authToken) {
        PumpActionReport report = pumpActionReportMapper.fromDto(actionReportDto);
        report.setEspDevice(espDeviceMapper.toModel(authToken));
        pumpActionService.save(report);
    }
    
    @RequestMapping(
        value = "/bootup/add",
        method = RequestMethod.POST
    )
    public void newBoot(@RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String authToken) {
        BootupReport report = new BootupReport();
        report.setEspDevice(espDeviceMapper.toModel(authToken));
        bootupService.create(report);
    }
}
