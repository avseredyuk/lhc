package com.avseredyuk.service;

import com.avseredyuk.model.BootupReport;
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
    
    @Autowired
    public BootupService(BootupRepository bootupRepository,
        ConfigService configService) {
        this.bootupRepository = bootupRepository;
        this.configService = configService;
    }
    
    @Cacheable("BootupReport")
    public List<BootupReport> getLastReports() {
        return bootupRepository.getLastReports();
    }
    
    @CacheEvict(value = "BootupReport", allEntries = true)
    public void create() {
        bootupRepository.cleanUp(configService.getCleanupIntervalDays());
        bootupRepository.save(new BootupReport());
    }
}
