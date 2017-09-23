package com.avseredyuk.service;

import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.repository.PumpActionRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    public List<PumpActionReport> getLastReports(Integer tzOffset) {
        return pumpActionRepository.getLastReports()
            .stream()
            .map(r -> {
                r.setDateTime(r.getDateTime().minusMinutes(tzOffset));
                return r;
            })
            .collect(Collectors.toList());
    }
    
    public void save(PumpActionReport pumpActionReport) {
        pumpActionRepository.persist(pumpActionReport);
    }
}
