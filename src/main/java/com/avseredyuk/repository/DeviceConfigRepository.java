package com.avseredyuk.repository;

import com.avseredyuk.model.DeviceConfig;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 8/18/18.
 */
@Repository
public interface DeviceConfigRepository extends CrudRepository<DeviceConfig, Long> {
    
    List<DeviceConfig> findAllByDeviceToken(String deviceToken);
    
}
