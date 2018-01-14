package com.avseredyuk.repository;

import com.avseredyuk.model.BootupReport;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lenfer on 10/9/17.
 */
@Repository
public interface BootupRepository extends CrudRepository<BootupReport, Long> {
    
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM bootup WHERE date_time < NOW() - CAST(?1 || ' days' as INTERVAL)")
    void cleanUp(long daysCount);
    
    @Query(nativeQuery = true, value = "SELECT * FROM bootup ORDER BY date_time DESC LIMIT 5")
    List<BootupReport> getLastReports();

}
