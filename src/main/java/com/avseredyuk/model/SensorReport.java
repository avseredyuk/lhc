package com.avseredyuk.model;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "sensor_report")
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
    
    @Column(name = "abs_humidity")
    private Double absoluteHumidity;
    
    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;
    
    @PrePersist
    public void initDateTime() {
        this.dateTime = new Date();
    }
}
