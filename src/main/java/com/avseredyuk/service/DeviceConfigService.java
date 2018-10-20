package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceConfig;
import com.avseredyuk.model.DeviceConfig.DeviceConfigKey;
import com.avseredyuk.repository.DeviceConfigRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 8/11/18.
 */
@Service
public class DeviceConfigService {
    private final DeviceService deviceService;
    private final DeviceConfigRepository deviceConfigRepository;
    
    @Autowired
    public DeviceConfigService(DeviceConfigRepository deviceConfigRepository,
        DeviceService deviceService) {
        this.deviceConfigRepository = deviceConfigRepository;
        this.deviceService = deviceService;
    }
    
    public Map<String,String> getConfig(Device device) {
        if (deviceService.isTrustedDevice(device)) {
            List<DeviceConfig> deviceConfigList = deviceConfigRepository.findAllByDeviceToken(device.getToken());
    
            Map<String,String> result = deviceConfigList
                .stream()
                .collect(Collectors.toMap(DeviceConfig::getKey, DeviceConfig::getValue));
            
            deviceConfigList.stream()
                .filter(deviceConfig ->
                    deviceConfig.getKey().equals(DeviceConfigKey.RUN_PUMP_ONCE.toString())
                        && Boolean.valueOf(deviceConfig.getValue()))
                .findFirst()
                .ifPresent(deviceConfig -> deviceConfigRepository.disablePumpRunOnce(deviceConfig.getId()));
            
            return result;
        } else {
            throw new AccessDeniedException();
        }
    }
}
