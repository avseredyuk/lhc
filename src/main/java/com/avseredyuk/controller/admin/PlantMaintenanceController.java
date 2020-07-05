package com.avseredyuk.controller.admin;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RestController;

import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.PlantMaintenanceService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin/devices/{deviceId}/maintenance")
public class PlantMaintenanceController {

    @Autowired
    private PlantMaintenanceMapper plantMaintenanceMapper;
    @Autowired
    private PlantMaintenanceService plantMaintenanceService;
    @Autowired
    private DeviceMapper deviceMapper;

    @PostMapping(consumes = "application/json")
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> createMaintenance(@PathVariable Long deviceId,
                                                                            @RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModelCreate(plantMaintenanceDto);
        plantMaintenance.setDevice(deviceMapper.toModelFromId(deviceId));
        plantMaintenance.getDetails().forEach(d -> d.setPlantMaintenance(plantMaintenance));
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.saveOrThrow(plantMaintenance))));
    }

    @GetMapping
    public Page<PlantMaintenanceDto> getAllMaintenancesByDevice(@PathVariable Long deviceId,
                                                                @NotNull final Pageable pageable) {
        return plantMaintenanceService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

    @GetMapping(value = "/{plantMaintenanceId}")
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> getMaintenanceById(@PathVariable Long deviceId,
                                                                             @PathVariable Long plantMaintenanceId) {
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.findOne(plantMaintenanceId))));
    }

    @PutMapping(
            value = "/{plantMaintenanceId}",
            consumes = "application/json"
    )
    public void updateMaintenance(@PathVariable Long deviceId, @PathVariable Long plantMaintenanceId,
                                  @RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModelUpdate(plantMaintenanceDto);
        plantMaintenance.setDevice(deviceMapper.toModelFromId(deviceId));
        plantMaintenance.getDetails().forEach(d -> d.setPlantMaintenance(plantMaintenance));
        plantMaintenanceService.saveOrThrow(plantMaintenance);
    }

    @DeleteMapping(value = "/{plantMaintenanceId}")
    public void deleteMaintenance(@PathVariable Long deviceId, @PathVariable Long plantMaintenanceId) {
        plantMaintenanceService.delete(plantMaintenanceId);
    }
}