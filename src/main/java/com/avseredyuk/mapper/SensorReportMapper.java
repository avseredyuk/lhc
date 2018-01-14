package com.avseredyuk.mapper;

import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.model.SensorReport;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 1/7/18.
 */
@Component
@Mapper(componentModel = "spring")
public interface SensorReportMapper {
    
    @Mapping(target = "temperature", source = "t")
    @Mapping(target = "waterTemperature", source = "w")
    @Mapping(target = "humidity", source = "h")
    @Mapping(target = "volume", source = "v")
    @Mapping(target = "ppm", source = "p")
    SensorReport fromDto(SensorReportDto dto);
    
    @Mapping(target = "d", expression = "java(r.getDateTime().getTime())")
    @Mapping(target = "t", source = "temperature")
    @Mapping(target = "w", source = "waterTemperature")
    @Mapping(target = "h", source = "humidity")
    @Mapping(target = "v", source = "volume")
    @Mapping(target = "p", source = "ppm")
    SensorReportDto toDto(SensorReport r);
    
    List<SensorReportDto> toDtoList(List<SensorReport> list);
    
}
