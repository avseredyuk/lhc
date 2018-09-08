package com.avseredyuk.mapper;

import com.avseredyuk.model.Device;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 6/16/18.
 */
@Component
@Mapper(componentModel = "spring")
public interface DeviceMapper {
    
    @Mapping(target = "token", source = "deviceToken")
    Device toModel(String deviceToken);
    
}
