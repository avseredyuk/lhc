package com.avseredyuk.repository;

import com.avseredyuk.model.Device;
import com.avseredyuk.model.Device;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 6/16/18.
 */
@Repository
public interface DeviceRepository extends CrudRepository<Device, String> {
    Device findById(long id);
    Device findByToken(String token);
    List<Device> findByEnabledTrue();
}
