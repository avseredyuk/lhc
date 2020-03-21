package com.avseredyuk.service;

import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.exception.DeviceNotFoundException;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.repository.PlantMaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PlantMaintenanceService {
    
    @Autowired
    private PlantMaintenanceRepository plantMaintenanceRepository;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private PlantMaintenanceMapper plantMaintenanceMapper;
    
    public PlantMaintenance saveOrThrow(PlantMaintenance plantMaintenance) {
        plantMaintenance.setDevice(
            deviceService.findById(plantMaintenance.getDevice().getId())
                .orElseThrow(DeviceNotFoundException::new)
        );
        return plantMaintenanceRepository.save(plantMaintenance);
    }
    
    public PlantMaintenance findOne(Long plantMaintenanceId) {
        return plantMaintenanceRepository.findOne(plantMaintenanceId);
    }

    public Page<PlantMaintenanceDto> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        Page<PlantMaintenance> page = plantMaintenanceRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
        return new PageImpl<>(plantMaintenanceMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }
    
    public void update(PlantMaintenance plantMaintenance) {
        plantMaintenanceRepository.save(plantMaintenance);
    }
    
    public void delete(Long plantMaintenanceId) {
        plantMaintenanceRepository.delete(plantMaintenanceId);
    }
    
}
