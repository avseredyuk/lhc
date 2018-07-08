package com.avseredyuk.service;

import com.avseredyuk.model.Config;
import com.avseredyuk.model.Config.ConfigKey;
import com.avseredyuk.model.Config.ConfigType;
import com.avseredyuk.repository.ConfigRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 1/7/18.
 */
@Service
public class ConfigService {
    private final ConfigRepository configRepository;
    
    //todo: caching for all entries ??
    
    @Autowired
    public ConfigService(ConfigRepository configRepository) {
        this.configRepository = configRepository;
    }
    
    public Config getByKey(String key) {
        return configRepository.findOne(key);
    }
    
    public List<Config> getAllByType(ConfigType type) {
        return configRepository.findAllByType(type);
    }
    
    public Config save(Config config) {
        return configRepository.save(config);
    }
    
    public Long getHoursCount() {
        return Long.parseLong(this.getByKey(ConfigKey.HISTORY_SIZE_HOURS.toString()).getValue());
    }
    
    public Long getCleanupIntervalDays() {
        return Long.parseLong(this.getByKey(ConfigKey.CLEANUP_INTERVAL_DAYS.toString()).getValue());
    }
    
}
