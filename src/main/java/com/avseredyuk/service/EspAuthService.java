package com.avseredyuk.service;

import com.avseredyuk.model.EspDevice;
import com.avseredyuk.repository.EspAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 6/16/18.
 */
@Service
public class EspAuthService {
    
    private final EspAuthRepository espAuthRepository;
    
    @Autowired
    public EspAuthService(EspAuthRepository espAuthRepository) {
        this.espAuthRepository = espAuthRepository;
    }
    
    public boolean isTrustedDevice(EspDevice device) {
        if (device != null && device.getToken() != null) {
            EspDevice deviceFromDatabase = espAuthRepository.findByToken(device.getToken());
            if ((deviceFromDatabase != null) && deviceFromDatabase.getEnabled()) {
                return true;
            }
        }
        return false;
            
    }
    
    public EspDevice findByToken(String token) {
        return espAuthRepository.findByToken(token);
    }
    
}
