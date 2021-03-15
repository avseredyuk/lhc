package com.avseredyuk.controller.admin;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.PlantMaintenanceService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin/maintenance")
public class PlantMaintenanceController {

    @Autowired
    private PlantMaintenanceMapper plantMaintenanceMapper;
    @Autowired
    private PlantMaintenanceService plantMaintenanceService;
    @Autowired
    private DeviceMapper deviceMapper;

    @PostMapping(consumes = "application/json")
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> createMaintenance(@RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModelCreate(plantMaintenanceDto);
        plantMaintenance.setDevice(deviceMapper.toModelFromId(plantMaintenanceDto.getDeviceId()));
        plantMaintenance.getDetails().forEach(d -> d.setPlantMaintenance(plantMaintenance));
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.saveOrThrow(plantMaintenance))));
    }

    @GetMapping
    public Page<PlantMaintenanceDto> getAllMaintenancesByDevice(@RequestParam Long deviceId,
                                                                @NotNull final Pageable pageable) {
        Page<PlantMaintenance> page = plantMaintenanceService.findAllByDeviceIdPaginated(deviceId, pageable);
        return new PageImpl<>(plantMaintenanceMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }

    @GetMapping(value = "/{plantMaintenanceId}")
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> getMaintenanceById(@PathVariable Long plantMaintenanceId) {
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.findOne(plantMaintenanceId))));
    }

    @PutMapping(consumes = "application/json")
    public void updateMaintenance(@RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModelUpdate(plantMaintenanceDto);
        plantMaintenance.setDevice(deviceMapper.toModelFromId(plantMaintenanceDto.getDeviceId()));
        plantMaintenance.getDetails().forEach(d -> d.setPlantMaintenance(plantMaintenance));
        plantMaintenanceService.saveOrThrow(plantMaintenance);
    }

    @DeleteMapping(value = "/{plantMaintenanceId}")
    public void deleteMaintenance(@PathVariable Long plantMaintenanceId) {
        plantMaintenanceService.delete(plantMaintenanceId);
    }
}
