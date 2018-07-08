package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.EspDevice;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.repository.PumpActionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 9/18/17.
 */
@Service
public class PumpActionService {
    private PumpActionRepository pumpActionRepository;
    private ConfigService configService;
    private EspAuthService espAuthService;
    
    @Autowired
    public PumpActionService(PumpActionRepository pumpActionRepository,
        ConfigService configService, EspAuthService espAuthService) {
        this.pumpActionRepository = pumpActionRepository;
        this.configService = configService;
        this.espAuthService = espAuthService;
    }
    
    @Cacheable("PumpAction")
    public List<PumpActionReport> getLastReports() {
        return pumpActionRepository.getLastReports(configService.getHoursCount());
    }
    
    @CacheEvict(value = "PumpAction", allEntries = true)
    public void save(PumpActionReport report) {
        if (espAuthService.isTrustedDevice(report.getEspDevice())) {
            pumpActionRepository.cleanUp(configService.getCleanupIntervalDays());
            report.setEspDevice(espAuthService.findByToken(report.getEspDevice().getToken()));
            pumpActionRepository.save(report);
        } else {
            throw new AccessDeniedException();
        }
        
    }
}
