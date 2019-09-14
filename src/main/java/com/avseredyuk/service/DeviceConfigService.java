package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceConfig;
import com.avseredyuk.model.DeviceConfig.DeviceConfigKey;
import com.avseredyuk.repository.DeviceConfigRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeviceConfigService {
    private static final String CONFIG_HASH = "CONFIG_HASH";
    private final DeviceService deviceService;
    private final DeviceConfigRepository deviceConfigRepository;
    
    @Autowired
    public DeviceConfigService(DeviceConfigRepository deviceConfigRepository,
        DeviceService deviceService) {
        this.deviceConfigRepository = deviceConfigRepository;
        this.deviceService = deviceService;
    }
    
    public Map<String, String> getConfig(Device device) {
        if (deviceService.isTrustedDevice(device)) {
            List<DeviceConfig> deviceConfigList = deviceConfigRepository.findAllByDeviceToken(device.getToken());
    
            Map<String, String> result = deviceConfigList
                .stream()
                .collect(Collectors.toMap(DeviceConfig::getKey, DeviceConfig::getValue));
            
            String configHash = DigestUtils.sha1Hex(result.entrySet()
                .stream()
                .map(entry -> entry.getKey() + entry.getValue())
                .collect(Collectors.joining()));
            result.put(CONFIG_HASH, configHash);
            
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
    
    public boolean enableRunPumpOnceOrThrow(Long deviceId) throws InconsistentDataException {
        Optional<DeviceConfig> config = deviceConfigRepository.findByDeviceIdAndKey(deviceId, DeviceConfigKey.RUN_PUMP_ONCE.toString());
        if (config.isPresent()) {
            DeviceConfig deviceConfig = config.get();
            deviceConfig.setValue("TRUE");
            deviceConfigRepository.save(deviceConfig);
            return true;
        } else {
            throw new InconsistentDataException("No DeviceConfig to update");
        }
    }
}
