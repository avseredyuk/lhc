package com.avseredyuk.service;

import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.Config;
import com.avseredyuk.model.Config.ConfigKey;
import com.avseredyuk.repository.ConfigRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {
    private final ConfigRepository configRepository;
    
    @Autowired
    public ConfigService(ConfigRepository configRepository) {
        this.configRepository = configRepository;
    }
    
    public Config getByKey(String key) {
        return configRepository.findOne(key);
    }
    
    public List<Config> findAll() {
        return configRepository.findAll();
    }

    public Config updateOrThrow(Config config) {
        configRepository.findByKey(config.getKey())
                .orElseThrow(() -> new InconsistentDataException("No config found by provided key"));
        return configRepository.save(config);
    }

    public Config saveOrThrow(Config config) {
        if (configRepository.findByKey(config.getKey()).isPresent()) {
            throw new InconsistentDataException("Already existing key");
        }
        return configRepository.save(config);
    }
    
    public Long getHoursCount() {
        return Long.parseLong(this.getByKey(ConfigKey.HISTORY_SIZE_HOURS.toString()).getValue());
    }
    
}
