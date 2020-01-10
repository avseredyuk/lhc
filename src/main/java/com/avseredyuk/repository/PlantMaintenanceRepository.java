package com.avseredyuk.repository;

import com.avseredyuk.model.PlantMaintenance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlantMaintenanceRepository extends JpaRepository<PlantMaintenance, Long> {
    
    Page<PlantMaintenance> findAllByDeviceIdOrderByDateTimeDesc(Long deviceId, Pageable pageable);
    
}
