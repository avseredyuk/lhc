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
        Device fetchedDevice = deviceService.findTrustedDevice(device)
                .orElseThrow(AccessDeniedException::new);

        Map<String, String> result = fetchedDevice.getConfig()
                .stream()
                .collect(Collectors.toMap(DeviceConfig::getKey, DeviceConfig::getValue));

        String configHash = DigestUtils.sha1Hex(result.entrySet()
                .stream()
                .map(entry -> entry.getKey() + entry.getValue())
                .collect(Collectors.joining()));
        result.put(CONFIG_HASH, configHash);

        fetchedDevice.getConfig().stream()
                .filter(deviceConfig ->
                        deviceConfig.getKey().equals(DeviceConfigKey.RUN_PUMP_ONCE.toString())
                                && Boolean.valueOf(deviceConfig.getValue()))
                .findFirst()
                .ifPresent(deviceConfig -> deviceConfigRepository.disablePumpRunOnce(deviceConfig.getId()));

        return result;
    }
    
    public boolean enableRunPumpOnceOrThrow(Long deviceId) throws InconsistentDataException {
        DeviceConfig config = deviceConfigRepository.findByDeviceIdAndKey(deviceId, DeviceConfigKey.RUN_PUMP_ONCE.toString())
                .orElseThrow(() -> new InconsistentDataException("No DeviceConfig to update"));
        config.setValue("TRUE");
        deviceConfigRepository.save(config);
        return true;
    }
}
