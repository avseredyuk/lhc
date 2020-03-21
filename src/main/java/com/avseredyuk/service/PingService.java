package com.avseredyuk.service;

import com.avseredyuk.dto.internal.PingDto;
import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.mapper.internal.PingMapper;
import com.avseredyuk.model.Ping;
import com.avseredyuk.model.PlantMaintenance;
import com.avseredyuk.repository.PingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PingService {

    @Autowired
    private PingRepository pingRepository;
    @Autowired
    private PingMapper pingMapper;

    public void createPing(Long deviceId) {
        Ping ping = new Ping();
        ping.setDeviceId(deviceId);
        pingRepository.save(ping);
    }

    public Optional<Ping> getLastPingByDeviceId(Long deviceId) {
        return pingRepository.findFirstByDeviceIdOrderByDateTimeDesc(deviceId);
    }

    public Page<PingDto> findAllByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        Page<Ping> page =  pingRepository.findAllByDeviceIdOrderByDateTimeDesc(deviceId, pageable);
        return new PageImpl<>(pingMapper.toDtoList(page.getContent()), pageable, page.getTotalElements());
    }

}
