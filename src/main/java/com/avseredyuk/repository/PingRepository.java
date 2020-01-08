package com.avseredyuk.repository;

import com.avseredyuk.model.Ping;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PingRepository extends CrudRepository<Ping, Ping.PingPK> {

    Optional<Ping> findFirstByDeviceIdOrderByDateTimeDesc(Long deviceId);

}
