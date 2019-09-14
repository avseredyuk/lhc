package com.avseredyuk.service;

import com.avseredyuk.dto.internal.PlantMaintenanceWrapperDto;
import com.avseredyuk.exception.DeviceNotFoundException;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.repository.PlantMaintenanceRepository;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    public Map<String, PlantMaintenanceWrapperDto> findAllByActiveDevices() {
        return deviceService.findAllActive().stream()
            .map(d -> Pair.of(
                d.getName(),
                new PlantMaintenanceWrapperDto(d.getId(), plantMaintenanceMapper.toDtoList(plantMaintenanceRepository.findAllByDeviceIdOrderByDateTimeDesc(d.getId())))))
            .collect(Collectors.toMap(Pair::getLeft, Pair::getRight));
    }
    
    public void update(PlantMaintenance plantMaintenance) {
        plantMaintenanceRepository.save(plantMaintenance);
    }
    
    public void delete(Long plantMaintenanceId) {
        plantMaintenanceRepository.delete(plantMaintenanceId);
    }
    
}
