package com.avseredyuk.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * Created by lenfer on 6/16/18.
 */
@Data
@Entity
@Table(name = "esp_device")
public class EspDevice {
    
    //todo: does persist works???
    
    //todo: remove esp token row from config table in 'prod'
    
    //todo: clean bootup, reports, pump_actions bbefore running new version
    
    //todo: how it should be looking on UI ??? several charts ??? -- one chart because second esp won't have sensors ???
    
    //todo: group all data in history by device id
    
    //todo: set ServerToken to each esp to verify that server is trustable
    
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
}
