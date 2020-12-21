package com.avseredyuk.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "device")
public class Device {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "token")
    private String token;
    
    @Column(name = "device_name")
    private String name;
    
    @Column(name = "enabled")
    private Boolean enabled;

    @Column(name = "notes")
    private String notes;
    
    @OneToMany(mappedBy = "device", cascade = {CascadeType.PERSIST, CascadeType.REMOVE, CascadeType.MERGE},
            orphanRemoval = true)
    @OrderBy("deviceConfigType ASC, key ASC")
    private List<DeviceConfig> config;
    
    @OneToMany(mappedBy = "device", cascade = {CascadeType.PERSIST, CascadeType.REMOVE, CascadeType.MERGE},
            orphanRemoval = true)
    @OrderBy("map ASC")
    private List<DeviceReportDataExclusion> exclusions;

    public String getDeviceConfigByKey(String key) {
        return this.config
                .stream()
                .filter(deviceConfig -> deviceConfig.getKey().toString().equals(key))
                .map(DeviceConfig::getValue)
                .findFirst()
                .orElse(null);
    }

    public interface DeviceName {
        String getName();
    }
    
}
