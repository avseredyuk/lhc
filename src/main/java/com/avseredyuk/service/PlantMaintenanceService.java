package com.avseredyuk.service;

import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.model.PlantMaintenanceDetail;
import com.avseredyuk.repository.PlantMaintenanceRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;

@Service
public class PlantMaintenanceService {
    
    @Autowired
    private PlantMaintenanceRepository plantMaintenanceRepository;
    @Autowired
    private DeviceService deviceService;
    
    public PlantMaintenance saveOrThrow(PlantMaintenance plantMaintenance) {
        if (plantMaintenance.getPh() == null) {
            throw new InconsistentDataException("Invalid pH value");
        }
        if (plantMaintenance.getTds() == null) {
            throw new InconsistentDataException("Invalid TDS value");
        }
        if (plantMaintenance.getMaintenanceType() == null) {
            throw new InconsistentDataException("Invalid Maintenance Type value");
        }
        if (plantMaintenance.getDetails().stream()
                .map(PlantMaintenanceDetail::getValue)
                .anyMatch(StringUtils::isEmpty)) {
            throw new InconsistentDataException("Empty detail values are not allowed");
        }
        if (plantMaintenance.getDetails().stream()
                .collect(groupingBy(PlantMaintenanceDetail::getKey, counting()))
                .values()
                .stream()
                .anyMatch(countPerKey -> countPerKey != 1)) {
            throw new InconsistentDataException("Non-unique detail keys are not allowed");
        }
        plantMaintenance.setDevice(
            deviceService.findById(plantMaintenance.getDevice().getId())
                .orElseThrow(() -> new InconsistentDataException("Device not found"))
        );
        return plantMaintenanceRepository.save(plantMaintenance);
    }
    
    public PlantMaintenance findOne(Long plantMaintenanceId) {
        return plantMaintenanceRepository.findOne(plantMaintenanceId);
    }

    public Page<PlantMaintenance> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        return plantMaintenanceRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
    }

    public void delete(Long plantMaintenanceId) {
        plantMaintenanceRepository.delete(plantMaintenanceId);
    }
    
}
