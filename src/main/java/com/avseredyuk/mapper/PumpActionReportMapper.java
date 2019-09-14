package com.avseredyuk.mapper;

import com.avseredyuk.dto.PumpActionReportDto;
import com.avseredyuk.model.PumpActionReport;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface PumpActionReportMapper {
    
    @Mapping(target = "actionType", source = "a")
    PumpActionReport fromDto(PumpActionReportDto dto);
    
    @Deprecated
    @Mapping(target = "d", expression = "java(r.getDateTime().getTime())")
    @Mapping(target = "a", source = "actionType")
    PumpActionReportDto toDto(PumpActionReport r);
    
    @Deprecated
    List<PumpActionReportDto> toDtoList(List<PumpActionReport> list);
}
