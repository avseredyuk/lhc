package com.avseredyuk.service;

import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.Device;
import com.avseredyuk.repository.DeviceRepository;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    public Optional<Device> findById(long id) {
        return deviceRepository.findById(id);
    }
    
    public Optional<Device> findActiveById(long id) {
        return deviceRepository.findByIdAndEnabledTrue(id);
    }

    public Optional<Device> findTrustedDevice(Device device) {
        if (device != null && device.getToken() != null) {
            Device deviceFromDatabase = deviceRepository.findByToken(device.getToken());
            if ((deviceFromDatabase != null) && deviceFromDatabase.getEnabled()) {
                return Optional.of(deviceFromDatabase);
            }
        }
        return Optional.empty();
    }
    
    public List<Device> findAllActive() {
        return deviceRepository.findByEnabledTrue();
    }
    
    public List<Device> findAll() {
        return deviceRepository.findAllByOrderByIdAsc();
    }
    
    public Device saveOrThrow(Device device) throws InconsistentDataException {
        Device devFromDb = deviceRepository.findByToken(device.getToken());
        if (Objects.isNull(devFromDb)) {
            return deviceRepository.save(device);
        } else {
            throw new InconsistentDataException("Token has to be unique");
        }
    }
    
    public Device update(Device device) {
        return deviceRepository.save(device);
    }
    
    public void delete(Long deviceId) {
        deviceRepository.delete(deviceId);
    }
}
