package com.avseredyuk.repository;

import com.avseredyuk.model.PlantMaintenance;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlantMaintenanceRepository extends JpaRepository<PlantMaintenance, Long> {
    
    List<PlantMaintenance> findAllByDeviceIdOrderByDateTimeDesc(Long deviceId);
    
}
