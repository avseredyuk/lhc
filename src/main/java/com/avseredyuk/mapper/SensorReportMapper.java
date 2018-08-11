package com.avseredyuk.mapper;

import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.model.SensorReport;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
    SensorReport fromDto(SensorReportDto dto);
    
    @Mapping(target = "d", expression = "java(r.getDateTime().getTime())")
    @Mapping(target = "t", source = "temperature")
    @Mapping(target = "w", source = "waterTemperature")
    @Mapping(target = "h", source = "humidity")
    SensorReportDto toDto(SensorReport r);
    
    List<SensorReportDto> toDtoList(List<SensorReport> list);
    
    default Map<String, Number> toDtoStripped(SensorReport r) {
        Map<String, Number> map = new HashMap<>();
        if (r.getTemperature() != null) {
            map.put("t", r.getTemperature());
        }
        if (r.getHumidity() != null) {
            map.put("h", r.getHumidity());
        }
        if (r.getWaterTemperature() != null) {
            map.put("w", r.getWaterTemperature());
        }
        map.put("d", r.getDateTime().getTime());
        return map;
    }
    
    List<Map<String, Number>> toDtoStrippedList(List<SensorReport> r);
    
}
