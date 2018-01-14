package com.avseredyuk.mapper;

import com.avseredyuk.dto.BootupReportDto;
import com.avseredyuk.model.BootupReport;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * Created by lenfer on 1/7/18.
 */
@Component
@Mapper(componentModel = "spring")
public interface BootupReportMapper {
    
    @Mapping(target = "d", expression = "java(r.getDateTime().getTime())")
    BootupReportDto toDto(BootupReport r);
    
    List<BootupReportDto> toDtoList(List<BootupReport> list);
    
}
