package com.avseredyuk.model;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by lenfer on 9/13/17.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "pump_action")
public class PumpActionReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "date_time")
    private Date dateTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action_type")
    private PumpActionType actionType;
    
    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;
    
    @PrePersist
    public void initDateTime() {
        this.dateTime = new Date();
    }
    
    public enum PumpActionType {
        ENABLED, DISABLED
    }
    
}
