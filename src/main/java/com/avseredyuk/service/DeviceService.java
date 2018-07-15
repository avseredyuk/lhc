package com.avseredyuk.service;

import com.avseredyuk.model.Device;
import com.avseredyuk.repository.DeviceRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 6/16/18.
 */
@Service
public class DeviceService {
    
    private final DeviceRepository deviceRepository;
    
    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }
    
    public boolean isTrustedDevice(Device device) {
        if (device != null && device.getToken() != null) {
            Device deviceFromDatabase = deviceRepository.findByToken(device.getToken());
            if ((deviceFromDatabase != null) && deviceFromDatabase.getEnabled()) {
                return true;
            }
        }
        return false;
            
    }
    
    public Device findByToken(String token) {
        return deviceRepository.findByToken(token);
    }
    
    public List<Device> findAllActive() {
        return deviceRepository.findByEnabledTrue();
    }
}
