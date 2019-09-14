package com.avseredyuk.mapper;

import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.model.SensorReport;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface SensorReportMapper {
    
    @Mapping(target = "temperature", source = "t")
    @Mapping(target = "waterTemperature", source = "w")
    @Mapping(target = "humidity", source = "h")
    SensorReport fromDto(SensorReportDto dto);
    
    @Deprecated
    @Mapping(target = "d", expression = "java(r.getDateTime().getTime())")
    @Mapping(target = "t", source = "temperature")
    @Mapping(target = "w", source = "waterTemperature")
    @Mapping(target = "h", source = "humidity")
    SensorReportDto toDto(SensorReport r);
    
    @Deprecated
    List<SensorReportDto> toDtoList(List<SensorReport> list);
    
}
