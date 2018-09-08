package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.Device;
import com.avseredyuk.repository.BootupRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 10/8/17.
 */
@Service
public class BootupService {
    private BootupRepository bootupRepository;
    private ConfigService configService;
    private DeviceService deviceService;
    
    @Autowired
    public BootupService(BootupRepository bootupRepository,
        ConfigService configService, DeviceService deviceService) {
        this.bootupRepository = bootupRepository;
        this.configService = configService;
        this.deviceService = deviceService;
    }
    
    @Cacheable("BootupReport")
    public List<BootupReport> getLastReportsByDevice(Device device) {
        return bootupRepository.getLastReports(device.getId());
    }
    
    @CacheEvict(value = "BootupReport", allEntries = true)
    public void create(BootupReport report) {
        if (deviceService.isTrustedDevice(report.getDevice())) {
            bootupRepository.cleanUp(configService.getCleanupIntervalDays());
            report.setDevice(deviceService.findByToken(report.getDevice().getToken()));
            bootupRepository.save(report);
        } else {
            throw new AccessDeniedException();
        }
    }
}
