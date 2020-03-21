package com.avseredyuk.model;

import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.OrderBy;

@Data
@Entity
@Table(name = "plant_maintenance")
public class PlantMaintenance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "date_time")
    private Date dateTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type")
    private MaintenanceType maintenanceType;
    
    @Column(name = "ph")
    private Double ph;
    
    @Column(name = "tds")
    private Double tds;
    
    @OneToMany(mappedBy = "plantMaintenance", cascade = {CascadeType.PERSIST, CascadeType.REMOVE, CascadeType.MERGE},
            orphanRemoval = true)
    @OrderBy(clause = "key ASC")
    private List<PlantMaintenanceDetail> details;
    
    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;
    
    public enum MaintenanceType {
        FULL, PARTIAL, SAMPLE
    }
    
    @PrePersist
    public void initDateTime() {
        this.dateTime = new Date();
    }
}
