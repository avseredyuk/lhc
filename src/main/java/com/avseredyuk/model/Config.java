package com.avseredyuk.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * Created by lenfer on 1/7/18.
 */
@Data
@Entity
@Table(name = "cfg")
public class Config {
    
    @Id
    @Column(name = "cfg_key")
    private String key;
    
    @Column(name = "cfg_value")
    private String value;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "cfg_type")
    private ConfigType type;
    
    public enum ConfigType {
        ESP, LHC
    }
    
    public enum ConfigKey {
        HISTORY_SIZE_HOURS, CLEANUP_INTERVAL_DAYS, ESP_AUTH_TOKEN
    }
}
