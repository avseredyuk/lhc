package com.avseredyuk.repository;

import com.avseredyuk.model.PumpActionReport;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lenfer on 9/13/17.
 */
@Repository
public interface PumpActionRepository extends CrudRepository<PumpActionReport, Long> {
    
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM pump_actions WHERE date_time < NOW() - CAST(?1 || ' days' as INTERVAL)")
    void cleanUp(long daysCount);
    
    @Query(nativeQuery = true, value = "SELECT * FROM pump_actions WHERE device_id = ?1 AND date_time >= NOW() - CAST(?2 || ' hours' as INTERVAL) ORDER BY date_time DESC")
    List<PumpActionReport> getLastReports(Long deviceId, long hoursCount);
    
}
