package com.avseredyuk.service;

import com.avseredyuk.dto.internal.BootupDto;
import com.avseredyuk.exception.UnknownDeviceException;
import com.avseredyuk.mapper.internal.BootupMapper;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.Device;
import com.avseredyuk.repository.BootupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BootupService {

    @Autowired
    private BootupRepository bootupRepository;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private BootupMapper bootupMapper;

    @Cacheable("BootupReport")
    public Optional<BootupReport> getLastReportByDevice(Device device) {
        return bootupRepository.findFirstByDeviceIdOrderByIdDesc(device.getId());
    }

    @CacheEvict(value = "BootupReport", allEntries = true)
    public void create(BootupReport report) {
        Device fetchedDevice = deviceService.findByToken(report.getDevice().getToken());
        report.setDevice(fetchedDevice);
        bootupRepository.save(report);
    }

    public Page<BootupDto> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        Page<BootupReport> page =  bootupRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
        return new PageImpl<>(bootupMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }
}
