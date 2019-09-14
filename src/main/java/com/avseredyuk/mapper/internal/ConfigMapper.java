package com.avseredyuk.mapper.internal;

import com.avseredyuk.dto.internal.ConfigDto;
import com.avseredyuk.model.Config;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ConfigMapper {
    
    @Mapping(target = "key", source = "key")
    @Mapping(target = "value", source = "value")
    ConfigDto toDto(Config c);
    
    List<ConfigDto> toDtoList(List<Config> c);
    
}
