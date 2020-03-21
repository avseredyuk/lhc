package com.avseredyuk.controller;

import com.avseredyuk.configuration.TokenProvider;
import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.dto.internal.ConfigDto;
import com.avseredyuk.dto.internal.DeviceDto;
import com.avseredyuk.dto.internal.LoginDto;
import com.avseredyuk.dto.internal.PingDto;
import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.dto.internal.PumpActionDto;
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
import com.avseredyuk.service.PingService;
import com.avseredyuk.service.PlantMaintenanceService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.internal.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import javax.validation.constraints.NotNull;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin")
public class AdminController {

    //todo: split this shitty controller into several ones
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
    @Autowired
    private PingService pingService;
    @Autowired
    private PumpActionService pumpActionService;
    @Autowired
    private CacheService cacheService;
    
    @RequestMapping(value = "/generate-token", method = RequestMethod.POST)
    public ResponseEntity<AuthToken> generate(@RequestBody LoginDto loginDto) {
        
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
    public List<HistoryDto> getHistory(@RequestParam(required = false) Long sinceTimestamp) {
        return historyService.getHistory(sinceTimestamp);
    }
    
    @RequestMapping(
        value = "/devices",
        method = RequestMethod.GET
    )
    public List<DeviceDto> getAllDevices() {
        return deviceMapper.toDtoList(deviceService.findAll());
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
        value = "/devices/{deviceId}/maintenance",
        method = RequestMethod.POST,
        consumes = "application/json"
    )
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> createMaintenance(@PathVariable Long deviceId,
                                                                            @RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModel(plantMaintenanceDto);
        plantMaintenance.setDevice(deviceMapper.toModelFromId(deviceId));
        plantMaintenance.getDetails().forEach(d -> d.setPlantMaintenance(plantMaintenance));
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.saveOrThrow(plantMaintenance))));
    }

    @RequestMapping(
        value = "/devices/{deviceId}/maintenance",
        method = RequestMethod.GET
    )
    public Page<PlantMaintenanceDto> getAllMaintenancesByDevice(@PathVariable Long deviceId,
                                                                @NotNull final Pageable pageable) {
        return plantMaintenanceService.findAllByDeviceIdPaginated(deviceId, pageable);
    }
    
    @RequestMapping(
        value = "/devices/{deviceId}/maintenance/{plantMaintenanceId}",
        method = RequestMethod.GET
    )
    public ResponseEntity<ApiResult<PlantMaintenanceDto>> getMaintenanceById(@PathVariable Long deviceId,
                                                                             @PathVariable Long plantMaintenanceId) {
        return ResponseEntity.ok(new ApiResult<>(plantMaintenanceMapper.toDto(plantMaintenanceService.findOne(plantMaintenanceId))));
    }
    
    @RequestMapping(
        value = "/devices/{deviceId}/maintenance",
        method = RequestMethod.PUT,
        consumes = "application/json"
    )
    public void updateMaintenance(@PathVariable Long deviceId, @RequestBody PlantMaintenanceDto plantMaintenanceDto) {
        PlantMaintenance plantMaintenance = plantMaintenanceMapper.toModel(plantMaintenanceDto);
        plantMaintenanceService.update(plantMaintenance);
    }
    
    @RequestMapping(
        value = "/devices/{deviceId}/maintenance/{plantMaintenanceId}",
        method = RequestMethod.DELETE
    )
    public void deleteMaintenance(@PathVariable Long deviceId, @PathVariable Long plantMaintenanceId) {
        plantMaintenanceService.delete(plantMaintenanceId);
    }

    @RequestMapping(
            value = "/devices/{deviceId}/pings",
            method = RequestMethod.GET
    )
    public Page<PingDto> getAllPingsByDevice(@PathVariable Long deviceId,
                                             @NotNull final Pageable pageable) {
        return pingService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

    @RequestMapping(
            value = "/devices/{deviceId}/pumpactions",
            method = RequestMethod.GET
    )
    public Page<PumpActionDto> getAllPumpActionsByDevice(@PathVariable Long deviceId,
                                                         @NotNull final Pageable pageable) {
        return pumpActionService.findAllByDeviceIdPaginated(deviceId, pageable);
    }

    @RequestMapping(
            value = "/clearcache",
            method = RequestMethod.POST
    )
    public ResponseEntity<ApiResult<Boolean>> clearCache() {
        return ResponseEntity.ok(new ApiResult<>(cacheService.clearCache()));
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

    //todo: ticket: do smth in FE with navigation & deviceName in header - it should get it via rest and not as a route->route param
        //but it actually works in plant mainenance list page - clean it up before using new approach
    //todo: ticket: add "device" to the path of all DeviceController request methods
        //requires changes in device code
        //(don't forget to update web security config)
}
