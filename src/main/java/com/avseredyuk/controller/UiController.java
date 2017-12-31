package com.avseredyuk.controller;

import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.service.GaugeProvidingService;
import com.avseredyuk.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lenfer on 10/11/17.
 */
@RestController
public class UiController {
    private final HistoryService historyService;
    private final GaugeProvidingService gaugeProvidingService;
    
    @Autowired
    public UiController(HistoryService historyService, GaugeProvidingService gaugeProvidingService) {
        this.historyService = historyService;
        this.gaugeProvidingService = gaugeProvidingService;
    }
    
    @RequestMapping(
        value = "/history",
        method = RequestMethod.GET
    )
    public HistoryDto getHistory() {
        return historyService.getHistory();
    }
    
    @ResponseBody
    @RequestMapping(
        value = "/gauge",
        method = RequestMethod.GET,
        produces = "image/png"
    )
    public byte[] getGauge() {
        return gaugeProvidingService.getGauge();
    }
    
}
