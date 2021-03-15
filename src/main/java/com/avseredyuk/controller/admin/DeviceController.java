package com.avseredyuk.controller.admin;

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
import org.springframework.web.bind.annotation.RestController;

import com.avseredyuk.dto.internal.DeviceDto;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.DeviceConfigService;
import com.avseredyuk.service.DeviceService;

import javax.validation.constraints.NotNull;

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

    @GetMapping
    public Page<DeviceDto> getAllDevices(@NotNull final Pageable pageable) {
        Page<Device> page = deviceService.findAllPaginated(pageable);
        return new PageImpl<>(deviceMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }

    @GetMapping(value = "/{deviceId}")
    public ResponseEntity<ApiResult<DeviceDto>> getDevice(@PathVariable Long deviceId) {
        return deviceService.findById(deviceId)
                .map(device -> ResponseEntity.ok(new ApiResult<>(deviceMapper.toDto(device))))
                .orElseGet(ResponseEntity.notFound()::build);
    }

    @GetMapping(value = "/{deviceId}/full-name")
    public ResponseEntity<ApiResult<DeviceDto>> getDeviceFullName(@PathVariable Long deviceId) {
        return deviceService.findNameById(deviceId)
                .map(device -> ResponseEntity.ok(new ApiResult<>(deviceMapper.toDtoNamesOnly(device))))
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

    @PutMapping(value = "/{deviceId}/run-pump-once")
    public ResponseEntity<ApiResult<Boolean>> runPumpOnce(@PathVariable Long deviceId) {
        return ResponseEntity.ok(new ApiResult<>(deviceConfigService.enableRunPumpOnceOrThrow(deviceId)));
    }

}
