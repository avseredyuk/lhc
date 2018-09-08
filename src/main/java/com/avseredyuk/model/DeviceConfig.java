package com.avseredyuk.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;

/**
 * Created by lenfer on 8/12/18.
 */
@Data
@Entity
@Table(name = "device_cfg")
public class DeviceConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "cfg_key")
    private String key;
    
    @Column(name = "cfg_value")
    private String value;
    
    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;
    
    public enum DeviceConfigKey {
        PUMP_ENABLE_FREQUENCY, PUMP_DURATION, REPORT_SEND_FREQUENCY
    }
}
