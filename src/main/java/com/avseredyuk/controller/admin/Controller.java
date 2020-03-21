package com.avseredyuk.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import com.avseredyuk.configuration.TokenProvider;
import com.avseredyuk.dto.HistoryDto;
import com.avseredyuk.dto.internal.ConfigDto;
import com.avseredyuk.dto.internal.LoginDto;
import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.mapper.internal.ConfigMapper;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.model.internal.AuthToken;
import com.avseredyuk.service.ConfigService;
import com.avseredyuk.service.HistoryService;
import com.avseredyuk.service.internal.CacheService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin")
public class Controller {

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
    private CacheService cacheService;
    
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
    
    //todo: why this not using respo entity & apiresult: here & everywhere else since removed unused constructor from ApiResult with list param that causes clash
    @GetMapping(value = "/configs")
    public List<ConfigDto> getAllConfigs() {
        return configMapper.toDtoList(configService.findAll());
    }

    @PostMapping(value = "/clearcache")
    public ResponseEntity<ApiResult<Boolean>> clearCache() {
        return ResponseEntity.ok(new ApiResult<>(cacheService.clearCache()));
    }
    
    @ExceptionHandler({ InconsistentDataException.class })
    public ResponseEntity<ApiResult> handleInconsistentDataException(InconsistentDataException ex, WebRequest request) {
        return ResponseEntity.badRequest().body(new ApiResult(ex.getMessage()));
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

    //todo: ticket: do smth in FE with navigation & deviceName in header - it should get it via rest and not as a route->route param
        //but it actually works in plant mainenance list page - clean it up before using new approach
    //todo: ticket: add "device" to the path of all DeviceController request methods
        //requires changes in device code
        //(don't forget to update web security config)
}
