package com.avseredyuk.service;

import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.Config;
import com.avseredyuk.model.Config.ConfigKey;
import com.avseredyuk.repository.ConfigRepository;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {

    @Autowired
    private ConfigRepository configRepository;

    public Config getByKey(String key) {
        return configRepository.findOne(key);
    }
    
    public List<Config> findAll() {
        return configRepository.findAll();
    }

    public Config updateOrThrow(Config config) {
        if (StringUtils.isBlank(config.getKey())) {
            throw new InconsistentDataException("Empty key");
        }
        if (StringUtils.isBlank(config.getValue())) {
            throw new InconsistentDataException("Empty value");
        }
        if (!configRepository.findByKey(config.getKey()).isPresent()) {
            throw new InconsistentDataException("No config found by provided key");
        }
        return configRepository.save(config);
    }

    public Config saveOrThrow(Config config) {
        if (StringUtils.isBlank(config.getKey())) {
            throw new InconsistentDataException("Empty key");
        }
        if (StringUtils.isBlank(config.getValue())) {
            throw new InconsistentDataException("Empty value");
        }
        if (configRepository.findByKey(config.getKey()).isPresent()) {
            throw new InconsistentDataException("Already existing key");
        }
        return configRepository.save(config);
    }

    public void delete(String configKey) {
        configRepository.findByKey(configKey)
                .orElseThrow(() -> new InconsistentDataException("No config found by provided key"));
        configRepository.delete(configKey);
    }
    
    public Long getHoursCount() {
        Config config = this.getByKey(ConfigKey.HISTORY_SIZE_HOURS.toString());
        return Optional.ofNullable(config)
                .map(Config::getValue)
                .map(Long::parseLong)
                .orElse(0L);
    }
    
}
