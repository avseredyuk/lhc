package com.avseredyuk.service;

import com.avseredyuk.model.Device;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.repository.PumpActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PumpActionService {
    @Autowired
    private PumpActionRepository pumpActionRepository;
    @Autowired
    private ConfigService configService;
    @Autowired
    private DeviceService deviceService;

    public List<PumpActionReport> getLastReportsByDevice(Device device, Long sinceTimestamp) {
        if (sinceTimestamp == null) {
            // use cached version to load all pump actions for history endpoint
            return pumpActionRepository.getLastReports(device.getId(), configService.getHoursCount());
        } else {
            // use non-cached version to load all pump actions since provided timestamp
            return pumpActionRepository.findByDeviceIdAndDateTimeGreaterThanOrderByDateTimeDesc(device.getId(), new Date(sinceTimestamp));
        }
    }

    public Page<PumpActionReport> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        return pumpActionRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
    }
    
    public PumpActionReport getLastReportByDevice(Device device) {
        return pumpActionRepository.findFirstByDeviceIdOrderByIdDesc(device.getId());
    }
    
    @CacheEvict(value = "PumpAction", allEntries = true)
    public void save(PumpActionReport report) {
        Device fetchedDevice = deviceService.findByToken(report.getDevice().getToken());
        report.setDevice(fetchedDevice);
        pumpActionRepository.save(report);
    }

    @CacheEvict(value = "PumpAction", allEntries = true)
    public void delete(Long pumpActionId) {
        pumpActionRepository.delete(pumpActionId);
    }
}
