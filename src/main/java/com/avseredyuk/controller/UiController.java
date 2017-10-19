package com.avseredyuk.controller;

import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lenfer on 10/11/17.
 */
@RestController
public class UiController {
    private final HistoryService historyService;
    
    @Autowired
    public UiController(HistoryService historyService) {
        this.historyService = historyService;
    }
    
    @RequestMapping(
        value = "/history",
        method = RequestMethod.GET
    )
    public HistoryDto getHistory() {
        return historyService.getHistory();
    }
    
}
