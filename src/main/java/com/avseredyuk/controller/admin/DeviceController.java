package com.avseredyuk.controller.admin;

import java.util.List;

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

import com.avseredyuk.dto.internal.DeviceDto;
import com.avseredyuk.dto.internal.PingDto;
import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.dto.internal.PumpActionDto;
import com.avseredyuk.dto.internal.SensorDto;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.DeviceConfigService;
import com.avseredyuk.service.DeviceService;
import com.avseredyuk.service.PingService;
import com.avseredyuk.service.PlantMaintenanceService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.SensorReportService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin/devices")
public class DeviceController {

    @Autowired
    private DeviceMapper deviceMapper;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private DeviceConfigService deviceConfigService;
    @Autowired
    private PlantMaintenanceMapper plantMaintenanceMapper;
    @Autowired
    private PlantMaintenanceService plantMaintenanceService;
    @Autowired
    private PingService pingService;
    @Autowired
    private PumpActionService pumpActionService;
    @Autowired
    private SensorReportService sensorReportService;

    @GetMapping
    public List<DeviceDto> getAllDevices() {
        return deviceMapper.toDtoList(deviceService.findAll());
    }

    @GetMapping(value = "/{deviceId}")
    public ResponseEntity<ApiResult<DeviceDto>> getDevice(@PathVariable Long deviceId) {
        return deviceService.findById(deviceId)
                .map(device -> ResponseEntity.ok(new ApiResult<>(deviceMapper.toDto(device))))
                .orElseGet(ResponseEntity.notFound()::build);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<ApiResult<DeviceDto>> createDevice(@RequestBody DeviceDto deviceDto) {
        return ResponseEntity.ok(new ApiResult<>(deviceMapper.toDto(deviceService.saveOrThrow(deviceMapper.toModel(deviceDto)))));
    }

    @PutMapping(consumes = "application/json")
    public DeviceDto update(@RequestBody DeviceDto deviceDto) {
        return deviceMapper.toDto(deviceService.update(deviceMapper.toModel(deviceDto)));
    }

    @DeleteMapping(value = "/{deviceId}")
    public void deleteDevice(@PathVariable Long deviceId) {
        deviceService.delete(deviceId);
    }

    @PutMapping(value = "/{deviceId}/runPumpOnce")
    public ResponseEntity<ApiResult<Boolean>> runPumpOnce(@PathVariable Long deviceId) {
        return ResponseEntity.ok(new ApiResult<>(deviceConfigService.enableRunPumpOnceOrThrow(deviceId)));
    }

    @PostMapping(
            value = "/{deviceId}/maintenance",
            consumes = "application/json"
    )
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> createMaintenance(@PathVariable Long deviceId,
                                                                            @RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModel(plantMaintenanceDto);
        plantMaintenance.setDevice(deviceMapper.toModelFromId(deviceId));
        plantMaintenance.getDetails().forEach(d -> d.setPlantMaintenance(plantMaintenance));
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.saveOrThrow(plantMaintenance))));
    }

    @GetMapping(value = "/{deviceId}/maintenance")
    public Page<PlantMaintenanceDto> getAllMaintenancesByDevice(@PathVariable Long deviceId,
                                                                @NotNull final Pageable pageable) {
        return plantMaintenanceService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

    @GetMapping(value = "/{deviceId}/maintenance/{plantMaintenanceId}")
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> getMaintenanceById(@PathVariable Long deviceId,
                                                                             @PathVariable Long plantMaintenanceId) {
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.findOne(plantMaintenanceId))));
    }

    @PutMapping(
            value = "/{deviceId}/maintenance",
            consumes = "application/json"
    )
    public void updateMaintenance(@PathVariable Long deviceId, @RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModel(plantMaintenanceDto);
        plantMaintenanceService.update(plantMaintenance);
    }

    @DeleteMapping(value = "/{deviceId}/maintenance/{plantMaintenanceId}")
    public void deleteMaintenance(@PathVariable Long deviceId, @PathVariable Long plantMaintenanceId) {
        plantMaintenanceService.delete(plantMaintenanceId);
    }

    @GetMapping(value = "/{deviceId}/pings")
    public Page<PingDto> getAllPingsByDevice(@PathVariable Long deviceId,
                                             @NotNull final Pageable pageable) {
        return pingService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

    @GetMapping(value = "/{deviceId}/pumpactions")
    public Page<PumpActionDto> getAllPumpActionsByDevice(@PathVariable Long deviceId,
                                                         @NotNull final Pageable pageable) {
        return pumpActionService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

    @GetMapping(value = "/{deviceId}/sensorreports")
    public Page<SensorDto> getAllSensorReportsByDevice(@PathVariable Long deviceId,
                                                       @NotNull final Pageable pageable) {
        return sensorReportService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

}
