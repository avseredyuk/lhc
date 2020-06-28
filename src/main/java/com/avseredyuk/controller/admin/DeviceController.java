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

import com.avseredyuk.dto.internal.BootupDto;
import com.avseredyuk.dto.internal.DeviceDto;
import com.avseredyuk.dto.internal.PingDto;
import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.dto.internal.PumpActionDto;
import com.avseredyuk.dto.internal.SensorDto;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.BootupService;
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
    private PingService pingService;
    @Autowired
    private PumpActionService pumpActionService;
    @Autowired
    private SensorReportService sensorReportService;
    @Autowired
    private BootupService bootupService;

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

    @GetMapping(value = "/{deviceId}/name")
    public ResponseEntity<ApiResult<DeviceDto>> getDeviceName(@PathVariable Long deviceId) {
        return deviceService.findNameById(deviceId)
                .map(device -> ResponseEntity.ok(new ApiResult<>(deviceMapper.toDtoNameOnly(device))))
                .orElseGet(ResponseEntity.notFound()::build);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<ApiResult<DeviceDto>> createDevice(@RequestBody DeviceDto deviceDto) {
        return ResponseEntity.ok(new ApiResult<>(deviceMapper.toDto(deviceService.create(deviceMapper.toModel(deviceDto)))));
    }

    @PutMapping(value = "/{deviceId}",
            consumes = "application/json")
    public DeviceDto updateDevice(@PathVariable Long deviceId, @RequestBody DeviceDto deviceDto) {
        Device device = deviceMapper.toModel(deviceDto);
        device.getConfig().stream().forEach(c -> c.setDevice(device));
        device.getExclusions().stream().forEach(e -> e.setDevice(device));
        return deviceMapper.toDto(deviceService.update(device));
    }

    @DeleteMapping(value = "/{deviceId}")
    public void deleteDevice(@PathVariable Long deviceId) {
        deviceService.delete(deviceId);
    }

    @PutMapping(value = "/{deviceId}/runPumpOnce")
    public ResponseEntity<ApiResult<Boolean>> runPumpOnce(@PathVariable Long deviceId) {
        return ResponseEntity.ok(new ApiResult<>(deviceConfigService.enableRunPumpOnceOrThrow(deviceId)));
    }

    @GetMapping(value = "/{deviceId}/pings")
    public Page<PingDto> getAllPingsByDevice(@PathVariable Long deviceId,
                                             @NotNull final Pageable pageable) {
        return pingService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

    @GetMapping(value = "/{deviceId}/bootups")
    public Page<BootupDto> getAllBootupsByDevice(@PathVariable Long deviceId,
                                                 @NotNull final Pageable pageable) {
        return bootupService.findAllByDeviceIdPaginated(deviceId, pageable);
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
