package com.avseredyuk.mapper.internal;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.avseredyuk.dto.internal.PingDto;
import com.avseredyuk.model.Ping;

@Component
@Mapper(componentModel = "spring")
public interface PingMapper {

    @Mapping(target = "d", expression = "java(p.getDateTime().getTime())")
    PingDto toDto(Ping p);

    List<PingDto> toDtoList(List<Ping> c);
    
}
