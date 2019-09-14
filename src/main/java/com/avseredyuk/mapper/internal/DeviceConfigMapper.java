package com.avseredyuk.mapper.internal;

import com.avseredyuk.dto.internal.DeviceDto.DeviceConfigDto;
import com.avseredyuk.model.DeviceConfig;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface DeviceConfigMapper {
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "key", source = "key")
    @Mapping(target = "value", source = "value")
    DeviceConfigDto toDto(DeviceConfig d);
    
    List<DeviceConfigDto> toDtoList(List<DeviceConfig> list);
}
