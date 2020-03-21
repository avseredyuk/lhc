package com.avseredyuk.repository;

import com.avseredyuk.model.PumpActionReport;

import java.util.Date;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PumpActionRepository extends CrudRepository<PumpActionReport, Long> {

    @Cacheable("PumpAction")
    @Query(nativeQuery = true, value = "SELECT * FROM pump_action WHERE device_id = ?1 AND date_time >= NOW() - CAST(?2 || ' hours' as INTERVAL) ORDER BY date_time DESC")
    List<PumpActionReport> getLastReports(Long deviceId, long hoursCount);

    List<PumpActionReport> findByDeviceIdAndDateTimeGreaterThan(Long deviceId, Date sinceDate);
    
    PumpActionReport findFirstByDeviceIdOrderByIdDesc(Long deviceId);

    Page<PumpActionReport> findAllByDeviceIdOrderByDateTimeDesc(Long deviceId, Pageable pageable);
    
}
