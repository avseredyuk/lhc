package com.avseredyuk.mapper.internal;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.avseredyuk.dto.internal.SensorDto;
import com.avseredyuk.model.SensorReport;

@Component
@Mapper(componentModel = "spring")
public interface SensorMapper {
    
    @Deprecated
    @Mapping(target = "dateTime", expression = "java(r.getDateTime().getTime())")
    @Mapping(target = "temperature", source = "temperature")
    @Mapping(target = "relhumidity", source = "humidity")
    @Mapping(target = "abshumidity", source = "absoluteHumidity")
    @Mapping(target = "watertemperature", source = "waterTemperature")
    SensorDto toDto(SensorReport r);

    List<SensorDto> toDtoList(List<SensorReport> list);
    
}

