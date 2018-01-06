package com.avseredyuk.service;

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
    
    @Autowired
    public PumpActionService(PumpActionRepository pumpActionRepository) {
        this.pumpActionRepository = pumpActionRepository;
    }
    
    @Cacheable("PumpAction")
    public List<PumpActionReport> getLastReports() {
        return pumpActionRepository.getLastReports();
    }
    
    @CacheEvict(value = "PumpAction", allEntries = true)
    public void save(PumpActionReport pumpActionReport) {
        pumpActionRepository.cleanUp();
        pumpActionRepository.persist(pumpActionReport);
    }
}
