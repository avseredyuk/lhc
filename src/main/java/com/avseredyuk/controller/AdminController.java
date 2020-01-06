package com.avseredyuk.controller;

import com.avseredyuk.configuration.TokenProvider;
import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.dto.internal.ConfigDto;
import com.avseredyuk.dto.internal.DeviceDto;
import com.avseredyuk.dto.internal.LoginDto;
import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.dto.internal.PlantMaintenanceWrapperDto;
import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.mapper.internal.ConfigMapper;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.mapper.internal.PlantMaintenanceMapper;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.model.internal.AuthToken;
import com.avseredyuk.service.ConfigService;
import com.avseredyuk.service.DeviceConfigService;
import com.avseredyuk.service.DeviceService;
import com.avseredyuk.service.HistoryService;
import com.avseredyuk.service.PlantMaintenanceService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin")
public class AdminController {
    
    @Autowired
    private DeviceMapper deviceMapper;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private DeviceConfigService deviceConfigService;
    @Autowired
    private ConfigService configService;
    @Autowired
    private ConfigMapper configMapper;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenProvider jwtTokenUtil;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private PlantMaintenanceMapper plantMaintenanceMapper;
    @Autowired
    private PlantMaintenanceService plantMaintenanceService;
    
    @RequestMapping(value = "/generate-token", method = RequestMethod.POST)
    public ResponseEntity generate(@RequestBody LoginDto loginDto) {
        
        final Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(),
                loginDto.getPassword()
            )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtTokenUtil.generateToken(authentication);
        return ResponseEntity.ok(new AuthToken(token));
    }
    
    @RequestMapping(
        value = "/history",
        method = RequestMethod.GET
    )
    public List<HistoryDto> getHistory() {
        return historyService.getHistory();
    }
    
    @RequestMapping(
        value = "/devices",
        method = RequestMethod.GET
    )
    public List<DeviceDto> getAllDevices() {
        return deviceMapper.toDtoList(deviceService.findAll());
    }
    
    @RequestMapping(
        value = "/devices/active",
        method = RequestMethod.GET
    )
    public List<DeviceDto> getAllActiveDevices() {
        return deviceMapper.toDtoList(deviceService.findAllActive());
    }
    
    @RequestMapping(
        value = "/devices/{deviceId}",
        method = RequestMethod.GET
    )
    public ResponseEntity<ApiResult<DeviceDto>> getDevice(@PathVariable Long deviceId) {
        return deviceService.findById(deviceId)
            .map(device -> ResponseEntity.ok(new ApiResult<>(deviceMapper.toDto(device))))
            .orElseGet(ResponseEntity.notFound()::build);
    }
    
    @RequestMapping(
        value = "/devices",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public ResponseEntity<ApiResult<DeviceDto>> createDevice(@RequestBody DeviceDto deviceDto) {
        return ResponseEntity.ok(new ApiResult<>(deviceMapper.toDto(deviceService.saveOrThrow(deviceMapper.toModel(deviceDto)))));
    }
    
    @RequestMapping(
        value = "/devices",
        method = RequestMethod.PUT,
        consumes = "application/json"
    )
    public DeviceDto update(@RequestBody DeviceDto deviceDto) {
        return deviceMapper.toDto(deviceService.update(deviceMapper.toModel(deviceDto)));
    }
    
    @RequestMapping(
        value = "/devices/{deviceId}",
        method = RequestMethod.DELETE
    )
    public void deleteDevice(@PathVariable Long deviceId) {
        deviceService.delete(deviceId);
    }
    
    @RequestMapping(
        value = "/devices/{deviceId}/runPumpOnce",
        method = RequestMethod.PUT
    )
    public ResponseEntity<ApiResult<Boolean>> runPumpOnce(@PathVariable Long deviceId) {
        return ResponseEntity.ok(new ApiResult<>(deviceConfigService.enableRunPumpOnceOrThrow(deviceId)));
    }
    
    //todo: why this not using respo entity & apiresult: here & everywhere else since removed unused constructor from ApiResult with list param that causes clash
    @RequestMapping(
        value = "/configs",
        method = RequestMethod.GET
    )
    public List<ConfigDto> getAllConfigs() {
        return configMapper.toDtoList(configService.findAll());
    }
    
    @ExceptionHandler({ InconsistentDataException.class })
    public ResponseEntity<ApiResult> handleInconsistentDataException(InconsistentDataException ex, WebRequest request) {
        return ResponseEntity.badRequest().body(new ApiResult(ex.getMessage()));
    }
    
    @RequestMapping(
        value = "/maintenance",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> createMaintenance(@RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModel(plantMaintenanceDto);
        plantMaintenance.setDevice(deviceMapper.toModelFromId(plantMaintenanceDto.getDeviceId()));
        plantMaintenance.getDetails().forEach(d -> d.setPlantMaintenance(plantMaintenance));
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.saveOrThrow(plantMaintenance))));
    }
    
    @RequestMapping(
        value = "/maintenance",
        method = RequestMethod.GET
    )
    public Map<String, PlantMaintenanceWrapperDto> getAllMaintenance() {
        return plantMaintenanceService.findAllByActiveDevices();
    }
    
    @RequestMapping(
        value = "/maintenance/{plantMaintenanceId}",
        method = RequestMethod.GET
    )
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> getMaintenanceById(@PathVariable Long plantMaintenanceId) {
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.findOne(plantMaintenanceId))));
    }
    
    @RequestMapping(
        value = "/maintenance",
        method = RequestMethod.PUT,
        consumes = "application/json"
    )
    public void updateMaintenance(@RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModel(plantMaintenanceDto);
        plantMaintenanceService.update(plantMaintenance);
    }
    
    @RequestMapping(
        value = "/maintenance/{plantMaintenanceId}",
        method = RequestMethod.DELETE
    )
    public void deleteMaintenance(@PathVariable Long plantMaintenanceId) {
        plantMaintenanceService.delete(plantMaintenanceId);
    }
    
    //todo: BE: set up proper logging via log4j
    //todo: FE: routing protection to login via guard
    //todo: FE: replace confirm() calls with something more beautiful
    //todo: move from handmade security for DeviceController->service to some spring security stuff
    //todo: edit device
    //todo: edit device  ? device_cfg ?
    //todo: edit device  ? report_exclusions ?
    //todo: edit device in place ???
    //todo: delete device w/confirmation
    //todo: delete device  ? device_cfg ? -- remove with device
    //todo: delete device  ? report_exclusions ? -- remove with device
    //todo: edit config  -- in place ?
    //todo: delete config w/confirmation
    //todo: ~edit plant_maintenance & its details
}
