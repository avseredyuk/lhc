package com.avseredyuk.repository;

import com.avseredyuk.model.DeviceReportDataExclusion;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 7/22/18.
 */
@Repository
public interface DeviceReportDataExclusionRepository extends CrudRepository<DeviceReportDataExclusion, Long> {
    
    List<DeviceReportDataExclusion> findByDeviceId(Long deviceId);
    
}
