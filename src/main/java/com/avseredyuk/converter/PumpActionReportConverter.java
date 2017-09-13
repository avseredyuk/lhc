package com.avseredyuk.converter;

import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.model.PumpActionReport;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 9/13/17.
 */
@Component
@Scope("singleton")
public class PumpActionReportConverter {
    
    public PumpActionReportDto toDto(PumpActionReport r) {
        if (r != null) {
            PumpActionReportDto dto = new PumpActionReportDto();
            if (r.getActionType() != null) {
                dto.setActionType(r.getActionType().toString());
            }
            if (r.getDateTime() != null) {
                dto.setTimestamp(Timestamp.valueOf(r.getDateTime()).getTime());
            }
            return dto;
        } else {
            throw new IllegalArgumentException("PumpActionReport can not be null");
        }
    }
    
    public List<PumpActionReportDto> toDtoList(List<PumpActionReport> list) {
        if (list != null) {
            return list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("List of PumpActonReport can not be null");
        }
    }
    
}
