package com.avseredyuk.repository;

import com.avseredyuk.model.DeviceConfig;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lenfer on 8/18/18.
 */
@Repository
public interface DeviceConfigRepository extends CrudRepository<DeviceConfig, Long> {
    
    List<DeviceConfig> findAllByDeviceToken(String deviceToken);
    
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE device_cfg SET cfg_value = 'FALSE' WHERE id = ?1")
    void disablePumpRunOnce(Long deviceConfigId);
    
}
