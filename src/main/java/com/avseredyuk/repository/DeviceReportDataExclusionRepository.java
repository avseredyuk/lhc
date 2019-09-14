package com.avseredyuk.repository;

import com.avseredyuk.model.DeviceReportDataExclusion;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceReportDataExclusionRepository extends CrudRepository<DeviceReportDataExclusion, Long> {
    
}
