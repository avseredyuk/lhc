package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.repository.PumpActionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class PumpActionService {
    private PumpActionRepository pumpActionRepository;
    private ConfigService configService;
    private DeviceService deviceService;
    
    @Autowired
    public PumpActionService(PumpActionRepository pumpActionRepository,
        ConfigService configService, DeviceService deviceService) {
        this.pumpActionRepository = pumpActionRepository;
        this.configService = configService;
        this.deviceService = deviceService;
    }
    
    @Cacheable("PumpAction")
    public List<PumpActionReport> getLastReportsByDevice(Device device) {
        return pumpActionRepository.getLastReports(device.getId(), configService.getHoursCount());
    }
    
    public PumpActionReport getLastReportByDevice(Device device) {
        return pumpActionRepository.findFirstByDeviceIdOrderByIdDesc(device.getId());
    }
    
    @CacheEvict(value = "PumpAction", allEntries = true)
    public void save(PumpActionReport report) {
        if (deviceService.isTrustedDevice(report.getDevice())) {
            report.setDevice(deviceService.findByToken(report.getDevice().getToken()));
            pumpActionRepository.save(report);
        } else {
            throw new AccessDeniedException();
        }
    }
}
