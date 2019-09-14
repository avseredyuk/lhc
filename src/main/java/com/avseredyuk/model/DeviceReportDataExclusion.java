package com.avseredyuk.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "device_report_data_exclusion")
public class DeviceReportDataExclusion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "map")
    private ReportDataType map;
    
    public enum ReportDataType {
        AIR_TEMP,
        WATER_TEMP,
        HUMIDITY,
        PUMP,
        ABS_HUMIDITY
    }
}
