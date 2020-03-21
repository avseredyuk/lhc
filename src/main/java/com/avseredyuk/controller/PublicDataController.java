package com.avseredyuk.controller;

import com.avseredyuk.dto.internal.StatusDto;
import com.avseredyuk.service.GaugeProvidingService;
import com.avseredyuk.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class PublicDataController {
    
    @Autowired
    private GaugeProvidingService gaugeProvidingService;
    
    @Autowired
    private StatusService statusService;
    
    @ResponseBody
    @RequestMapping(
        value = "/gauge/{deviceId}",
        method = RequestMethod.GET,
        produces = "image/png"
    )
    public byte[] getGauge(@PathVariable Long deviceId) {
        return gaugeProvidingService.getGauge(deviceId);
    }
    
    @RequestMapping(
        value = "/status",
        method = RequestMethod.GET
    )
    public StatusDto getStatus() {
        return statusService.getStatus();
    }
}
