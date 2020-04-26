package com.avseredyuk.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.avseredyuk.dto.internal.PumpActionDto;
import com.avseredyuk.exception.UnknownDeviceException;
import com.avseredyuk.mapper.internal.PumpActionMapper;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.repository.PumpActionRepository;

@Service
public class PumpActionService {
    @Autowired
    private PumpActionRepository pumpActionRepository;
    @Autowired
    private ConfigService configService;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private PumpActionMapper pumpActionMapper;

    public List<PumpActionReport> getLastReportsByDevice(Device device, Long sinceTimestamp) {
        if (sinceTimestamp == null) {
            // use cached version to load all pump actions for history endpoint
            return pumpActionRepository.getLastReports(device.getId(), configService.getHoursCount());
        } else {
            // use non-cached version to load all pump actions since provided timestamp
            return pumpActionRepository.findByDeviceIdAndDateTimeGreaterThanOrderByDateTimeDesc(device.getId(), new Date(sinceTimestamp));
        }
    }

    public Page<PumpActionDto> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        Page<PumpActionReport> page = pumpActionRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
        return new PageImpl<>(pumpActionMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }
    
    public PumpActionReport getLastReportByDevice(Device device) {
        return pumpActionRepository.findFirstByDeviceIdOrderByIdDesc(device.getId());
    }
    
    @CacheEvict(value = "PumpAction", allEntries = true)
    public void save(PumpActionReport report) {
        Device fetchedDevice = deviceService.findTrustedDevice(report.getDevice())
                .orElseThrow(UnknownDeviceException::new);
        report.setDevice(fetchedDevice);
        pumpActionRepository.save(report);
    }
}
