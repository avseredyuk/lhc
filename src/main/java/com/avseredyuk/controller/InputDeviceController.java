package com.avseredyuk.controller;

import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.mapper.PumpActionReportMapper;
import com.avseredyuk.mapper.SensorReportMapper;
import com.avseredyuk.mapper.internal.DeviceMapper;
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

@RestController
public class InputDeviceController {
    private static final String AUTH_TOKEN_PARAM_NAME = "AuthToken";

    @Autowired
    private SensorReportService sensorReportService;
    @Autowired
    private PumpActionService pumpActionService;
    @Autowired
    private BootupService bootupService;
    @Autowired
    private DeviceConfigService deviceConfigService;
    @Autowired
    private PumpActionReportMapper pumpActionReportMapper;
    @Autowired
    private SensorReportMapper sensorReportMapper;
    @Autowired
    private DeviceMapper deviceMapper;
    
    @RequestMapping(
        value = "/report/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newReport(@RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken,
                          @RequestBody SensorReportDto reportDto) {
        SensorReport report = sensorReportMapper.fromDto(reportDto);
        report.setDevice(deviceMapper.toModelFromToken(deviceToken));
        sensorReportService.save(report);
    }
    
    @RequestMapping(
        value = "/pump/add",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public void newPumpAction(@RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken,
                              @RequestBody PumpActionReportDto actionReportDto) {
        PumpActionReport report = pumpActionReportMapper.fromDto(actionReportDto);
        report.setDevice(deviceMapper.toModelFromToken(deviceToken));
        pumpActionService.save(report);
    }
    
    @RequestMapping(
        value = "/bootup/add",
        method = RequestMethod.POST
    )
    public void newBoot(@RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken) {
        BootupReport report = new BootupReport();
        report.setDevice(deviceMapper.toModelFromToken(deviceToken));
        bootupService.create(report);
    }
    
    @RequestMapping(
        value = "/cfg",
        method = RequestMethod.GET
    )
    public Map<String,String> getDeviceConfig(
            @RequestHeader(value = AUTH_TOKEN_PARAM_NAME, required = false) String deviceToken) {
        return deviceConfigService.getConfig(deviceMapper.toModelFromToken(deviceToken));
    }
}
