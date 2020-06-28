package com.avseredyuk.mapper.internal;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.avseredyuk.dto.internal.SeasonDto;
import com.avseredyuk.model.fruit.Season;

@Component
@Mapper(componentModel = "spring")
public interface SeasonMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "crops", ignore = true)
    @Mapping(target = "deviceId", ignore = true)
    SeasonDto toDto(Season s);

    SeasonDto toDtoNameOnly(Season.SeasonName seasonName);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "device", ignore = true)
    @Mapping(target = "crops", ignore = true)
    Season toModel(SeasonDto s);

    @Mapping(target = "id", source = "seasonId")
    Season toModelFromId(Long seasonId);

    List<SeasonDto> toDtoList(List<Season> s);
}
