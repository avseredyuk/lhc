package com.avseredyuk.controller;

import com.avseredyuk.converter.BootupReportConverter;
import com.avseredyuk.converter.PumpActionReportConverter;
import com.avseredyuk.converter.SensorReportConverter;
import com.avseredyuk.dto.BootupReportDto;
import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.service.BootupService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.SensorReportService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lenfer on 10/11/17.
 */
@RestController
public class UiController {
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final BootupService bootupService;
    private final PumpActionReportConverter pumpActionReportConverter;
    private final SensorReportConverter sensorReportConverter;
    private final BootupReportConverter bootupReportConverter;
    
    @Autowired
    public UiController(SensorReportService sensorReportService,
        PumpActionService pumpActionService, BootupService bootupService,
        PumpActionReportConverter pumpActionReportConverter,
        SensorReportConverter sensorReportConverter,
        BootupReportConverter bootupReportConverter) {
        this.sensorReportService = sensorReportService;
        this.pumpActionService = pumpActionService;
        this.bootupService = bootupService;
        this.pumpActionReportConverter = pumpActionReportConverter;
        this.sensorReportConverter = sensorReportConverter;
        this.bootupReportConverter = bootupReportConverter;
    }
    
    @RequestMapping(
        value = "/report/history",
        method = RequestMethod.GET
    )
    public List<SensorReportDto> getLastReports() {
        return sensorReportConverter.toDtoList(sensorReportService.getLastReports());
    }
    
    @RequestMapping(
        value = "/pump/history",
        method = RequestMethod.GET
    )
    public List<PumpActionReportDto> getLastPumpActions() {
        return pumpActionReportConverter.toDtoList(pumpActionService.getLastReports());
    }
    
    @RequestMapping(
        value = "/bootup/history",
        method = RequestMethod.GET
    )
    public List<BootupReportDto> getLastBootups() {
        return bootupReportConverter.toDtoList(bootupService.getLastReports());
    }
}
