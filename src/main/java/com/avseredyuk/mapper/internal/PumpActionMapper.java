package com.avseredyuk.mapper.internal;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.avseredyuk.dto.internal.PumpActionDto;
import com.avseredyuk.model.PumpActionReport;

@Component
@Mapper(componentModel = "spring")
public interface PumpActionMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "dateTime", expression = "java(r.getDateTime().getTime())")
    @Mapping(target = "action", source = "actionType")
    PumpActionDto toDto(PumpActionReport r);

    List<PumpActionDto> toDtoList(List<PumpActionReport> list);

}
