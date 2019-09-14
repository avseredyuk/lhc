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
    public List<BootupReport> getLastReportsByDevice(Device device) {
        return bootupRepository.findFirst3ByDeviceIdOrderByIdDesc(device.getId());
    }
    
    //todo: bootup/pump/report creation service methods SUCK DICKS: 3 queries !! ( 2 x getDevice)
    //todo: make findByToken return optional & do findByToken.orElseThrow(AccessDeniedException::new)
    @CacheEvict(value = "BootupReport", allEntries = true)
    public void create(BootupReport report) {
        if (deviceService.isTrustedDevice(report.getDevice())) {
            report.setDevice(deviceService.findByToken(report.getDevice().getToken()));
            bootupRepository.save(report);
        } else {
            throw new AccessDeniedException();
        }
    }
}
