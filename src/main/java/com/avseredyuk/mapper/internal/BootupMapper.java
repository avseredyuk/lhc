package com.avseredyuk.mapper.internal;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.avseredyuk.dto.internal.BootupDto;
import com.avseredyuk.model.BootupReport;

@Component
@Mapper(componentModel = "spring")
public interface BootupMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "d", expression = "java(b.getDateTime().getTime())")
    BootupDto toDto(BootupReport b);

    List<BootupDto> toDtoList(List<BootupReport> b);
    
}
