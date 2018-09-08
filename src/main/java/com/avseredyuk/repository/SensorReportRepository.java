package com.avseredyuk.repository;

import com.avseredyuk.model.SensorReport;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lenfer on 9/9/17.
 */
@Repository
public interface SensorReportRepository extends CrudRepository<SensorReport, Long> {
    
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM sensor_report WHERE date_time < NOW() - CAST(?1 || ' days' as INTERVAL)")
    void cleanUp(long daysCount);
    
    @Query(nativeQuery = true, value = "SELECT * FROM sensor_report WHERE device_id = ?1 AND date_time >= NOW() - CAST(?2 || ' hours' as INTERVAL) ORDER BY date_time DESC")
    List<SensorReport> getLastReports(Long deviceId, long hoursCount);
    
    @Query(nativeQuery = true, value = "SELECT * FROM sensor_report WHERE device_id = ?1 ORDER BY date_time DESC LIMIT 1")
    SensorReport getLastReport(Long deviceId);

}
