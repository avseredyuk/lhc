package com.avseredyuk.model;

import java.time.LocalDateTime;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by lenfer on 9/8/17.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "reports")
public class SensorReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "date_time")
    private Date dateTime;
    
    @Column(name = "temperature")
    private Double temperature;
    
    @Column(name = "water_temperature")
    private Double waterTemperature;
    
    @Column(name = "humidity")
    private Double humidity;
    
    @Column(name = "volume")
    private Double volume;
    
    @Column(name = "ppm")
    private Double ppm;
    
    @PrePersist
    public void initDateTime() {
        this.dateTime = new Date();
    }
}
