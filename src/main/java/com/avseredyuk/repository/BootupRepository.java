package com.avseredyuk.repository;

import com.avseredyuk.model.BootupReport;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BootupRepository extends CrudRepository<BootupReport, Long> {
    
    List<BootupReport> findFirst3ByDeviceIdOrderByIdDesc(Long deviceId);

}
