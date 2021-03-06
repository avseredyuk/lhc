package com.avseredyuk.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.avseredyuk.dto.internal.ConfigDto;
import com.avseredyuk.mapper.internal.ConfigMapper;
import com.avseredyuk.model.Config;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.ConfigService;

import javax.validation.constraints.NotNull;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin/configs")
public class ConfigController {

    @Autowired
    private ConfigService configService;
    @Autowired
    private ConfigMapper configMapper;

    @GetMapping
    public Page<ConfigDto> getAllConfigs(@NotNull final Pageable pageable) {
        Page<Config> configs = configService.findAllPaginated(pageable);
        return new PageImpl<>(configMapper.toDtoList(configs.getContent()), pageable, configs.getTotalElements());
    }

    @GetMapping(value = "/{configKey}")
    public ResponseEntity<ApiResult<ConfigDto>> getConfigByKey(@PathVariable String configKey) {
        return ResponseEntity.ok(new ApiResult<>(configMapper.toDto(configService.getByKey(configKey))));
    }

    @PutMapping(consumes = "application/json")
    public void updateConfig(@RequestBody ConfigDto configDto) {
        Config config = configMapper.toModel(configDto);
        configService.updateOrThrow(config);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<ApiResult<ConfigDto>> createConfig(@RequestBody ConfigDto configDto) {
        Config config = configMapper.toModel(configDto);
        return ResponseEntity.ok(new ApiResult<>(configMapper.toDto(configService.saveOrThrow(config))));
    }

    @DeleteMapping(value = "/{configKey}")
    public void deleteConfig(@PathVariable String configKey) {
        configService.delete(configKey);
    }

}
