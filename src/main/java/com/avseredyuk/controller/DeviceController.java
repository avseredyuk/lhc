package com.avseredyuk.controller;

import com.avseredyuk.mapper.DeviceMapper;
import com.avseredyuk.mapper.PumpActionReportMapper;
import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.mapper.SensorReportMapper;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.service.BootupService;
import com.avseredyuk.service.DeviceConfigService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.SensorReportService;
import java.util.Map;
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
public class DeviceController {
    private static final String AUTH_TOKEN_PARAM_NAME = "AuthToken";
    
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final BootupService bootupService;
    private final DeviceConfigService deviceConfigService;
    private final PumpActionReportMapper pumpActionReportMapper;
    private final SensorReportMapper sensorReportMapper;
    private final DeviceMapper deviceMapper;
    
    @Autowired
    public DeviceController(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        DeviceConfigService deviceConfigService,
        PumpActionReportMapper pumpActionReportMapper, SensorReportMapper sensorReportMapper,
        DeviceMapper deviceMapper) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.deviceConfigService = deviceConfigService;
        this.pumpActionReportMapper = pumpActionReportMapper;
        this.sensorReportMapper = sensorReportMapper;
        this.deviceMapper = deviceMapper;
    }
    
    @RequestMapping(
        value = "/report/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newReport(@RequestBody SensorReportDto reportDto,
                          @RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken) {
        SensorReport report = sensorReportMapper.fromDto(reportDto);
        report.setDevice(deviceMapper.toModel(deviceToken));
        sensorReportService.save(report);
    }
    
    @RequestMapping(
        value = "/pump/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newPumpAction(@RequestBody PumpActionReportDto actionReportDto,
                              @RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken) {
        PumpActionReport report = pumpActionReportMapper.fromDto(actionReportDto);
        report.setDevice(deviceMapper.toModel(deviceToken));
        pumpActionService.save(report);
    }
    
    @RequestMapping(
        value = "/bootup/add",
        method = RequestMethod.POST
    )
    public void newBoot(@RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken) {
        BootupReport report = new BootupReport();
        report.setDevice(deviceMapper.toModel(deviceToken));
        bootupService.create(report);
    }
    
    @RequestMapping(
        value = "/cfg",
        method = RequestMethod.GET
    )
    public Map<String,String> getDeviceConfig(@RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken) {
        return deviceConfigService.getConfig(deviceMapper.toModel(deviceToken));
    }
}
