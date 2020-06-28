package com.avseredyuk.mapper.internal;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.avseredyuk.dto.internal.CropDto;
import com.avseredyuk.model.fruit.Crop;

@Component
@Mapper(componentModel = "spring")
public interface CropMapper {

    @Mapping(target = "weight", source = "weight")
    @Mapping(target = "count", source = "count")
    Crop toModelCreate(CropDto c);

    @Mapping(target = "weight", source = "weight")
    @Mapping(target = "count", source = "count")
    @Mapping(target = "dateTime", expression = "java(new java.util.Date(c.getD()))")
    Crop toModelUpdate(CropDto c);

    @Mapping(target = "weight", source = "weight")
    @Mapping(target = "count", source = "count")
    @Mapping(target = "d", expression = "java(c.getDateTime().getTime())")
    @Mapping(target = "id", source = "id")
    CropDto toDto(Crop c);

    List<CropDto> toDtoList(List<Crop> crops);
}
