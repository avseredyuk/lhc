package com.avseredyuk.model;

import java.time.LocalDateTime;

/**
 * Created by lenfer on 9/8/17.
 */
public class SensorReport {
    private Integer temperature;
    private LocalDateTime dateTime;
    
    public SensorReport() {
    }
    
    public SensorReport(Integer temperature, LocalDateTime dateTime) {
        this.temperature = temperature;
        this.dateTime = dateTime;
    }
    
    public Integer getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }
    
    public LocalDateTime getDateTime() {
        return dateTime;
    }
    
    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }
}
