package com.avseredyuk.service;

import com.avseredyuk.model.BootupReport;
import com.avseredyuk.repository.BootupRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 10/8/17.
 */
@Service
public class BootupService {
    private BootupRepository bootupRepository;
    
    @Autowired
    public BootupService(BootupRepository bootupRepository) {
        this.bootupRepository = bootupRepository;
    }
    
    public List<BootupReport> getLastReports() {
        return bootupRepository.getLastReports();
    }
    
    public void create() {
        bootupRepository.newBoot();
    }
}
