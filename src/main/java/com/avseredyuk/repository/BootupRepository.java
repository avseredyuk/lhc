package com.avseredyuk.repository;

import com.avseredyuk.model.BootupReport;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BootupRepository extends CrudRepository<BootupReport, Long> {
    
    Optional<BootupReport> findFirstByDeviceIdOrderByIdDesc(Long deviceId);

    Page<BootupReport> findAllByDeviceIdOrderByDateTimeDesc(Long deviceId, Pageable pageable);

}
