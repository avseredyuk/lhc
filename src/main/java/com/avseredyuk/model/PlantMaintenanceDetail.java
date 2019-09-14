package com.avseredyuk.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "plant_maintenance_detail")
public class PlantMaintenanceDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "detail_key")
    private String key;
    
    @Column(name = "detail_value")
    private String value;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_maintenance_id")
    private PlantMaintenance plantMaintenance;
    
}
