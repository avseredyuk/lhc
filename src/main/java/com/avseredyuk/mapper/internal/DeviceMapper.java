package com.avseredyuk.mapper.internal;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.avseredyuk.dto.internal.DeviceDto;
import com.avseredyuk.model.Device;

@Component
@Mapper(componentModel = "spring",
        uses = DeviceConfigMapper.class)
public interface DeviceMapper {
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "enabled", source = "enabled")
    @Mapping(target = "config", source = "config")
    DeviceDto toDto(Device d);

    DeviceDto toDtoNameOnly(Device.DeviceName deviceName);
    
    List<DeviceDto> toDtoList(List<Device> d);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "enabled", source = "enabled")
    Device toModel(DeviceDto d);

    @Mapping(target = "token", source = "deviceToken")
    Device toModelFromToken(String deviceToken);
    
    @Mapping(target = "id", source = "deviceId")
    Device toModelFromId(Long deviceId);
    
}