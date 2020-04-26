package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceConfig;
import com.avseredyuk.model.DeviceConfig.DeviceConfigKey;
import com.avseredyuk.repository.DeviceConfigRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DeviceConfigService {
    private static final String CONFIG_HASH = "CONFIG_HASH";

    @Autowired
    private DeviceService deviceService;
    @Autowired
    private DeviceConfigRepository deviceConfigRepository;
    @Autowired
    private PingService pingService;
    
    public Map<String, String> getConfig(Device device) {
        Device fetchedDevice = deviceService.findTrustedDevice(device)
                .orElseThrow(AccessDeniedException::new);

        pingService.createPing(fetchedDevice.getId());

        Map<String, String> result = fetchedDevice.getConfig()
                .stream()
                .filter(deviceConfig -> deviceConfig.getDeviceConfigType() == DeviceConfig.DeviceConfigType.DEVICE)
                .collect(Collectors.toMap(
                        dc ->dc.getKey().toString(),
                        DeviceConfig::getValue));

        String configHash = DigestUtils.sha1Hex(result.entrySet()
                .stream()
                .map(entry -> entry.getKey() + entry.getValue())
                .collect(Collectors.joining()));
        result.put(CONFIG_HASH, configHash);

        fetchedDevice.getConfig().stream()
                .filter(deviceConfig ->
                        deviceConfig.getKey() == DeviceConfigKey.RUN_PUMP_ONCE
                                && Boolean.valueOf(deviceConfig.getValue()))
                .findFirst()
                .ifPresent(deviceConfig -> deviceConfigRepository.disablePumpRunOnce(deviceConfig.getId()));

        return result;
    }
    
    public boolean enableRunPumpOnceOrThrow(Long deviceId) {
        DeviceConfig config = deviceConfigRepository.findByDeviceIdAndKey(deviceId, DeviceConfigKey.RUN_PUMP_ONCE.toString())
                .orElseThrow(() -> new InconsistentDataException("No DeviceConfig to update"));
        config.setValue("TRUE");
        deviceConfigRepository.save(config);
        return true;
    }
}
