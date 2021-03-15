package com.avseredyuk.service;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;

import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceConfig;
import com.avseredyuk.model.DeviceReportDataExclusion;
import com.avseredyuk.repository.DeviceRepository;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    public Optional<Device> findById(long id) {
        return deviceRepository.findById(id);
    }

    public Optional<Device.DeviceNames> findNameById(long id) {
        return deviceRepository.findNameById(id);
    }
    
    public Device findActiveById(long id) {
        return deviceRepository.findByIdAndEnabledTrue(id);
    }

    public Device findTrustedDevice(String token) {
        return deviceRepository.findByTokenAndEnabledTrue(token);
    }

    public Device findByToken(String token) {
        return deviceRepository.findByToken(token);
    }
    
    public List<Device> findAllActive() {
        return deviceRepository.findByEnabledTrue();
    }
    
    public Page<Device> findAllPaginated(Pageable pageable) {
        return deviceRepository.findAllByOrderByEnabledDescNameAsc(pageable);
    }
    
    public Device create(Device device) {
        if (StringUtils.isBlank(device.getName())) {
            throw new InconsistentDataException("Invalid name value");
        }
        if (StringUtils.isBlank(device.getToken())) {
            throw new InconsistentDataException("Invalid token value");
        }
        if (Objects.nonNull(deviceRepository.findByToken(device.getToken()))) {
            throw new InconsistentDataException("Non-unique token");
        }
        if (Objects.nonNull(deviceRepository.findByName(device.getName()))) {
            throw new InconsistentDataException("Non-unique name");
        }
        return deviceRepository.save(device);
    }
    
    public Device update(Device device) {
        if (StringUtils.isBlank(device.getName())) {
            throw new InconsistentDataException("Invalid name value");
        }
        if (StringUtils.isBlank(device.getToken())) {
            throw new InconsistentDataException("Invalid token value");
        }
        if (Objects.nonNull(deviceRepository.findByNameAndIdNot(device.getName(), device.getId()))) {
            throw new InconsistentDataException("Non-unique name");
        }
        if (Objects.nonNull(deviceRepository.findByTokenAndIdNot(device.getToken(), device.getId()))) {
            throw new InconsistentDataException("Non-unique token");
        }
        if (device.getConfig().stream()
                .collect(groupingBy(DeviceConfig::getKey, counting()))
                .values()
                .stream()
                .anyMatch(countPerKey -> countPerKey != 1)) {
            throw new InconsistentDataException("Non-unique device configuration keys are not allowed");
        }
        if (device.getConfig().stream()
                .map(DeviceConfig::getValue)
                .anyMatch(StringUtils::isEmpty)) {
            throw new InconsistentDataException("Empty device configuration values are not allowed");
        }
        if (device.getExclusions().stream()
                .collect(groupingBy(DeviceReportDataExclusion::getMap, counting()))
                .values()
                .stream()
                .anyMatch(countPerKey -> countPerKey != 1)) {
            throw new InconsistentDataException("Non-unique device exclusions are not allowed");
        }
        return deviceRepository.save(device);
    }
    
    public void delete(Long deviceId) {
        if (deviceRepository.findById(deviceId).isPresent()){
            deviceRepository.delete(deviceId);
        } else {
            throw new InconsistentDataException("No device with given id found");
        }
    }
}
