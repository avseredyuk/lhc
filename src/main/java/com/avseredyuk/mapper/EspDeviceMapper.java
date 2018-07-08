package com.avseredyuk.mapper;

import com.avseredyuk.model.EspDevice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 6/16/18.
 */
@Component
@Mapper(componentModel = "spring")
public interface EspDeviceMapper {
    
    @Mapping(target = "token", source = "authToken")
    EspDevice toModel(String authToken);
    
}
