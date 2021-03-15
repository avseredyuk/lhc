package com.avseredyuk.controller.admin;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.avseredyuk.mapper.internal.BootupMapper;
import com.avseredyuk.mapper.internal.PingMapper;
import com.avseredyuk.mapper.internal.PumpActionMapper;
import com.avseredyuk.mapper.internal.SensorMapper;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.Ping;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.model.SensorReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.avseredyuk.configuration.TokenProvider;
import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.dto.internal.BootupDto;
import com.avseredyuk.dto.internal.LoginDto;
import com.avseredyuk.dto.internal.PingDto;
import com.avseredyuk.dto.internal.PumpActionDto;
import com.avseredyuk.dto.internal.SensorDto;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.model.internal.AuthToken;
import com.avseredyuk.service.BootupService;
import com.avseredyuk.service.HistoryService;
import com.avseredyuk.service.PingService;
import com.avseredyuk.service.PumpActionService;
import com.avseredyuk.service.SensorReportService;
import com.avseredyuk.service.internal.CacheService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin")
public class Controller {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenProvider jwtTokenUtil;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private CacheService cacheService;
    @Autowired
    private PingService pingService;
    @Autowired
    private PumpActionService pumpActionService;
    @Autowired
    private SensorReportService sensorReportService;
    @Autowired
    private BootupService bootupService;
    @Autowired
    private BootupMapper bootupMapper;
    @Autowired
    private PingMapper pingMapper;
    @Autowired
    private PumpActionMapper pumpActionMapper;
    @Autowired
    private SensorMapper sensorMapper;
    
    @PostMapping(value = "/generate-token")
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
    
    @GetMapping(value = "/history")
    public List<HistoryDto> getHistory(@RequestParam(required = false) Long sinceTimestamp) {
        return historyService.getHistory(sinceTimestamp);
    }

    @GetMapping(value = "/pings")
    public Page<PingDto> getAllPingsByDevice(@RequestParam Long deviceId,
                                             @NotNull final Pageable pageable) {
        Page<Ping> page = pingService.findAllByDeviceIdPaginated(deviceId, pageable);
        return new PageImpl<>(pingMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }

    @GetMapping(value = "/bootups")
    public Page<BootupDto> getAllBootupsByDevice(@RequestParam Long deviceId,
                                                 @NotNull final Pageable pageable) {
        Page<BootupReport> bootups = bootupService.findAllByDeviceIdPaginated(deviceId, pageable);
        return new PageImpl<>(bootupMapper.toDtoList(bootups.getContent()), pageable, bootups.getTotalElements());
    }

    @DeleteMapping(value = "/bootups/{bootupId}")
    public void deleteBootup(@PathVariable Long bootupId) {
        bootupService.delete(bootupId);
    }

    @GetMapping(value = "/pump-actions")
    public Page<PumpActionDto> getAllPumpActionsByDevice(@RequestParam Long deviceId,
                                                         @NotNull final Pageable pageable) {
        Page<PumpActionReport> page = pumpActionService.findAllByDeviceIdPaginated(deviceId, pageable);
        return new PageImpl<>(pumpActionMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }

    @DeleteMapping(value = "/pump-actions/{pumpActionId}")
    public void deletePumpAction(@PathVariable Long pumpActionId) {
        pumpActionService.delete(pumpActionId);
    }

    @GetMapping(value = "/sensor-reports")
    public Page<SensorDto> getAllSensorReportsByDevice(@RequestParam Long deviceId,
                                                       @NotNull final Pageable pageable) {
        Page<SensorReport> page = sensorReportService.findAllByDeviceIdPaginated(deviceId, pageable);
        return new PageImpl<>(sensorMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }

    @DeleteMapping(value = "/sensor-reports/{sensorReportId}")
    public void deleteSensorReport(@PathVariable Long sensorReportId) {
        sensorReportService.delete(sensorReportId);
    }

    @PostMapping(value = "/clear-cache")
    public ResponseEntity<ApiResult<Boolean>> clearCache() {
        return ResponseEntity.ok(new ApiResult<>(cacheService.clearCache()));
    }
    
    //todo: BE: set up proper logging via log4j
    //todo: FE: routing protection to login via guard
    //todo: FE: replace confirm() calls with something more beautiful
    //todo: * validations
    //todo:     * some of the validations are done at the mapstruct level which sucks,
    //todo:     * some of them like field presence - not validated at all, so sql-related exceptions are being thrown
    //todo:     * move validations to some interceptor/framework stuff
    //todo: swagger?
}
