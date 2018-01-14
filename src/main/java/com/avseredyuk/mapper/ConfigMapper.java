package com.avseredyuk.mapper;

import com.avseredyuk.dto.ConfigDto;
import com.avseredyuk.model.Config;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 1/7/18.
 */
@Component
@Mapper(componentModel = "spring")
public interface ConfigMapper {
    
    ConfigDto toDto(Config config);
    
}
