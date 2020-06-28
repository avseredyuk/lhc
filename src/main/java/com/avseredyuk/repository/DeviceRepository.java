package com.avseredyuk.repository;

import com.avseredyuk.model.Device;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends CrudRepository<Device, Long> {
    Device findByToken(String token);
    Device findByName(String name);
    Device findByTokenAndEnabledTrue(String token);
    Optional<Device> findById(Long id);
    Optional<Device.DeviceName> findNameById(Long deviceId);
    Device findByIdAndEnabledTrue(Long id);
    List<Device> findByEnabledTrue();
    List<Device> findAllByOrderByEnabledDescNameAsc();
    Device findByNameAndIdNot(String name, Long id);
    Device findByTokenAndIdNot(String token, Long id);
}
