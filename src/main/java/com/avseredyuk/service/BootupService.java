package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.Device;
import com.avseredyuk.repository.BootupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BootupService {
    private BootupRepository bootupRepository;
    private DeviceService deviceService;
    
    @Autowired
    public BootupService(BootupRepository bootupRepository, DeviceService deviceService) {
        this.bootupRepository = bootupRepository;
        this.deviceService = deviceService;
    }

    @Cacheable("BootupReport")
    public Optional<BootupReport> getLastReportByDevice(Device device) {
        return bootupRepository.findFirstByDeviceIdOrderByIdDesc(device.getId());
    }

    @CacheEvict(value = "BootupReport", allEntries = true)
    public void create(BootupReport report) {
        Device fetchedDevice = deviceService.findTrustedDevice(report.getDevice())
                .orElseThrow(AccessDeniedException::new);
        report.setDevice(fetchedDevice);
        bootupRepository.save(report);
    }
}
