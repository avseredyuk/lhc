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

@Data
@Entity
@Table(name = "device_cfg")
public class DeviceConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "cfg_key")
    @Enumerated(EnumType.STRING)
    private DeviceConfigKey key;
    
    @Column(name = "cfg_value")
    private String value;

    @Column(name = "cfg_type")
    @Enumerated(EnumType.STRING)
    private DeviceConfigType deviceConfigType;
    
    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;
    
    public enum DeviceConfigKey {
        // DEVICE-related config keys
        PUMP_ENABLE_FREQUENCY, PUMP_DURATION, REPORT_SEND_FREQUENCY, RUN_PUMP_ONCE,
        RELAY_PIN, WATER_TEMP_PIN, AIR_TEMP_HUM_PIN,
        // UI-related config keys
        PUMP_COLOR, WATER_TEMPERATURE_COLOR, TEMPERATURE_COLOR, HUMIDITY_COLOR, ABS_HUMIDITY_COLOR
    }

    public enum DeviceConfigType {
        UI, DEVICE
    }
}
