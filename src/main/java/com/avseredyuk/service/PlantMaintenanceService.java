package com.avseredyuk.service;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;

import java.util.Map;
import java.util.stream.Collectors;

import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.exception.DeviceNotFoundException;
import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.model.PlantMaintenanceDetail;
import com.avseredyuk.repository.PlantMaintenanceRepository;

import org.apache.commons.lang3.StringUtils;
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

    public void delete(Long plantMaintenanceId) {
        plantMaintenanceRepository.delete(plantMaintenanceId);
    }
    
}
