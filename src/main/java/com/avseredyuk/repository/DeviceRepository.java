package com.avseredyuk.repository;

import com.avseredyuk.model.Device;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends CrudRepository<Device, Long> {
    Device findByToken(String token);
    Device findByName(String name);
    Device findByTokenAndEnabledTrue(String token);
    Optional<Device> findById(Long id);
    Optional<Device.DeviceNames> findNameById(Long deviceId);
    Device findByIdAndEnabledTrue(Long id);
    List<Device> findByEnabledTrue();
    Page<Device> findAllByOrderByEnabledDescNameAsc(Pageable pageable);
    Device findByNameAndIdNot(String name, Long id);
    Device findByTokenAndIdNot(String token, Long id);
}
