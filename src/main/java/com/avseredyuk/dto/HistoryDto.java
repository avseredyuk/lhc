package com.avseredyuk.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

/**
 * Created by lenfer on 10/18/17.
 */
@Data
public class HistoryDto {
    List<BootupReportDto> bootups = new ArrayList<>();
    List<PumpActionReportDto> pumps = new ArrayList<>();
    List<SensorReportDto> reports = new ArrayList<>();
    String uptime;
    
    public void calculateUptime() {
        long lastPumpTime = pumps.get(0).getT();
        long lastReportTime = reports.get(0).getD();
        long lastBootupTime = bootups.get(0).getD();
        long lastDataFromLHC = (lastPumpTime > lastReportTime) ? lastPumpTime : lastReportTime;
        LocalDateTime from = LocalDateTime.ofInstant(Instant.ofEpochMilli(lastDataFromLHC), ZoneId.of("UTC"));
        LocalDateTime to = LocalDateTime.ofInstant(Instant.ofEpochMilli(lastBootupTime), ZoneId.of("UTC"));
    
        long diffInSeconds = ChronoUnit.SECONDS.between(from, to);
        long diffInMinutes = ChronoUnit.MINUTES.between(from, to);
        long diffInHours = ChronoUnit.HOURS.between(from, to);
        long diffInDays = ChronoUnit.DAYS.between(from, to);
        
        this.uptime = String.format("%02d days %02d:%02d:%02d", diffInDays, diffInHours, diffInMinutes, diffInSeconds);
    }
}
