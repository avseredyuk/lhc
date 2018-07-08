package com.avseredyuk.service;

import com.avseredyuk.exception.AccessDeniedException;
import com.avseredyuk.model.BootupReport;
import com.avseredyuk.model.EspDevice;
import com.avseredyuk.repository.BootupRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 10/8/17.
 */
@Service
public class BootupService {
    private BootupRepository bootupRepository;
    private ConfigService configService;
    private EspAuthService espAuthService;
    
    @Autowired
    public BootupService(BootupRepository bootupRepository,
        ConfigService configService, EspAuthService espAuthService) {
        this.bootupRepository = bootupRepository;
        this.configService = configService;
        this.espAuthService = espAuthService;
    }
    
    @Cacheable("BootupReport")
    public List<BootupReport> getLastReports() {
        return bootupRepository.getLastReports();
    }
    
    @CacheEvict(value = "BootupReport", allEntries = true)
    public void create(BootupReport report) {
        if (espAuthService.isTrustedDevice(report.getEspDevice())) {
            bootupRepository.cleanUp(configService.getCleanupIntervalDays());
            report.setEspDevice(espAuthService.findByToken(report.getEspDevice().getToken()));
            bootupRepository.save(report);
        } else {
            throw new AccessDeniedException();
        }
        
    }
}
