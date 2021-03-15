package com.avseredyuk.service;

import com.avseredyuk.model.Device;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.SensorReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SensorReportService {

    @Autowired
    private SensorReportRepository sensorReportRepository;
    @Autowired
    private ConfigService configService;
    @Autowired
    private DeviceService deviceService;

    List<SensorReport> getLastReportsByDevice(Device device, Long sinceTimestamp) {
        if (sinceTimestamp == null) {
            // use cached version to load all reports for history endpoint
            return sensorReportRepository.getLastReports(device.getId(), configService.getHoursCount());
        } else {
            // use non-cached version to load all reports since provided timestamp
            return sensorReportRepository.findByDeviceIdAndDateTimeGreaterThanOrderByDateTimeDesc(device.getId(), new Date(sinceTimestamp));
        }
    }
    
    SensorReport getLastReportByDevice(Device device) {
        return sensorReportRepository.findFirstByDeviceIdOrderByIdDesc(device.getId());
    }
    
    @Caching(evict = {
        @CacheEvict(value = "Gauge", allEntries = true),
        @CacheEvict(value = "SensorReport", allEntries = true)
    })
    public void save(SensorReport report) {
        Device fetchedDevice = deviceService.findByToken(report.getDevice().getToken());
        report.setAbsoluteHumidity(calcAbsHumidity(report));
        report.setDevice(fetchedDevice);
        sensorReportRepository.save(report);
    }

    public Page<SensorReport> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        return sensorReportRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
    }

    @CacheEvict(value = "SensorReport", allEntries = true)
    public void delete(Long sensorReportId) {
        sensorReportRepository.delete(sensorReportId);
    }
    
    private static Double calcAbsHumidity(SensorReport r) {
        if ((r.getHumidity() == null) || (r.getTemperature() == null)) {
            return null;
        }
        double hum = r.getHumidity();
        double temp = r.getTemperature();
        return 216.7d * (hum / 100) * 6.112d * Math.exp(17.62d * temp / (243.12d + temp)) / (273.15d + temp);
    }
}
