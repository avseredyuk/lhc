package com.avseredyuk.service;

import com.avseredyuk.model.Ping;
import com.avseredyuk.repository.PingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PingService {

    @Autowired
    private PingRepository pingRepository;

    public void createPing(Long deviceId) {
        Ping ping = new Ping();
        ping.setDeviceId(deviceId);
        pingRepository.save(ping);
    }

    public Optional<Ping> getLastPingByDeviceId(Long deviceId) {
        return pingRepository.findFirstByDeviceIdOrderByDateTimeDesc(deviceId);
    }

    public Page<Ping> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        return pingRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
    }

}
