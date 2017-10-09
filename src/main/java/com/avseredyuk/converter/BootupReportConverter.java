package com.avseredyuk.converter;

import com.avseredyuk.dto.BootupReportDto;
import com.avseredyuk.model.BootupReport;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 10/9/17.
 */
@Component
@Scope("singleton")
public class BootupReportConverter {
    
    public BootupReportDto toDto(BootupReport r) {
        if (r != null) {
            BootupReportDto dto = new BootupReportDto();
            if (r.getDateTime() != null) {
                dto.setD(Timestamp.valueOf(r.getDateTime()).getTime());
            }
            return dto;
        } else {
            throw new IllegalArgumentException("BootupReport can not be null");
        }
    }
    
    public List<BootupReportDto> toDtoList(List<BootupReport> list) {
        if (list != null) {
            return list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("List of BootupReport can not be null");
        }
    }
}
