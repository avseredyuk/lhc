package com.avseredyuk.service;

import com.avseredyuk.converter.BootupReportConverter;
import com.avseredyuk.converter.PumpActionReportConverter;
import com.avseredyuk.converter.SensorReportConverter;
import com.avseredyuk.dto.HistoryDto;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 10/18/17.
 */
@Service
public class HistoryService {
    private final SensorReportService sensorReportService;
    private final PumpActionService pumpActionService;
    private final BootupService bootupService;
    private final PumpActionReportConverter pumpActionReportConverter;
    private final SensorReportConverter sensorReportConverter;
    private final BootupReportConverter bootupReportConverter;
    
    public HistoryService(SensorReportService sensorReportService,
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
    
    public HistoryDto getHistory() {
        HistoryDto h = new HistoryDto();
        h.getReports().addAll(sensorReportConverter.toDtoList(sensorReportService.getLastReports()));
        h.getPumps().addAll(pumpActionReportConverter.toDtoList(pumpActionService.getLastReports()));
        h.getBootups().addAll(bootupReportConverter.toDtoList(bootupService.getLastReports()));
        setUptime(h);
        return h;
    }
    
    public void setUptime(HistoryDto h) {
        long lastPumpTime = h.getPumps().isEmpty() ? 0 : h.getPumps().get(0).getD();
        long lastReportTime = h.getReports().isEmpty() ? 0 : h.getReports().get(0).getD();
        long lastBootupTime = h.getBootups().isEmpty() ? 0 : h.getBootups().get(0).getD();
        
        long lastDataFromLHC = Math.max(lastPumpTime, lastReportTime);
        
        if ((lastDataFromLHC == 0) || (lastBootupTime == 0)) {
            // with these values we can't calculate uptime
            h.setUptime("no data");
        }
        
        long[] intDiffs = getIntervalDifference(lastBootupTime, lastDataFromLHC);
        
        h.setUptime(String.format("%02d days %02d:%02d:%02d", intDiffs[0], intDiffs[1], intDiffs[2], intDiffs[3]));
    }
    
    private long[] getIntervalDifference(long startDateTimestamp, long endDateTimestamp){
        long[] result = new long[4];
        
        long different = endDateTimestamp - startDateTimestamp;
        
        long secondsInMilli = 1000;
        long minutesInMilli = secondsInMilli * 60;
        long hoursInMilli = minutesInMilli * 60;
        long daysInMilli = hoursInMilli * 24;
        
        result[0] = different / daysInMilli;
        different = different % daysInMilli;
    
        result[1] = different / hoursInMilli;
        different = different % hoursInMilli;
    
        result[2] = different / minutesInMilli;
        different = different % minutesInMilli;
    
        result[3] = different / secondsInMilli;
        
        return result;
    }
    
}
