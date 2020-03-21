package com.avseredyuk.repository;

import com.avseredyuk.model.SensorReport;

import java.util.Date;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorReportRepository extends CrudRepository<SensorReport, Long> {

    @Cacheable("SensorReport")
    @Query(nativeQuery = true, value = "SELECT * FROM sensor_report WHERE device_id = ?1 AND date_time >= NOW() - CAST(?2 || ' hours' as INTERVAL) ORDER BY date_time DESC")
    List<SensorReport> getLastReports(Long deviceId, long hoursCount);

    List<SensorReport> findByDeviceIdAndDateTimeGreaterThan(Long deviceId, Date sinceDate);
    
    SensorReport findFirstByDeviceIdOrderByIdDesc(Long deviceId);

}
