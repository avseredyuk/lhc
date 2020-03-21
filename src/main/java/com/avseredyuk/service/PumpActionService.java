package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.repository.PumpActionRepository;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
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

    public List<PumpActionReport> getLastReportsByDevice(Device device, Long sinceTimestamp) {
        if (sinceTimestamp == null) {
            // use cached version to load all pump actions for history endpoint
            return pumpActionRepository.getLastReports(device.getId(), configService.getHoursCount());
        } else {
            // use non-cached version to load all pump actions since provided timestamp
            return pumpActionRepository.findByDeviceIdAndDateTimeGreaterThan(device.getId(), new Date(sinceTimestamp));
        }
    }
    
    public PumpActionReport getLastReportByDevice(Device device) {
        return pumpActionRepository.findFirstByDeviceIdOrderByIdDesc(device.getId());
    }
    
    @CacheEvict(value = "PumpAction", allEntries = true)
    public void save(PumpActionReport report) {
        Device fetchedDevice = deviceService.findTrustedDevice(report.getDevice())
                .orElseThrow(AccessDeniedException::new);
        report.setDevice(fetchedDevice);
        pumpActionRepository.save(report);
    }
}
