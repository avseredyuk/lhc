package com.avseredyuk.converter;

import com.avseredyuk.dto.SensorReportDto;
import com.avseredyuk.model.SensorReport;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 9/15/17.
 */
@Component
@Scope("singleton")
public class SensorReportConverter {
    
    public SensorReportDto toDto(SensorReport r) {
        if (r != null) {
            SensorReportDto dto = new SensorReportDto();
            
            if (r.getDateTime() != null) {
                dto.setD(r.getDateTime());
            }
            if (r.getTemperature() != null) {
                dto.setT(r.getTemperature());
            }
            if (r.getHumidity() != null) {
                dto.setH(r.getHumidity());
            }
            if (r.getLuminosity() != null) {
                dto.setL(r.getLuminosity());
            }
            if (r.getVolume() != null) {
                dto.setV(r.getVolume());
            }
            if (r.getPpm() != null) {
                dto.setP(r.getPpm());
            }
            
            return dto;
        } else {
            throw new IllegalArgumentException("SensorReport can not be null");
        }
    }
    
    public List<SensorReportDto> toDtoList(List<SensorReport> list) {
        if (list != null) {
            return list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("List of SensorReport can not be null");
        }
    }
    
}
