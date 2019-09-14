package com.avseredyuk.mapper.internal;

import com.avseredyuk.dto.internal.PlantMaintenanceDetailDto;
import com.avseredyuk.model.PlantMaintenanceDetail;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface PlantMaintenanceDetailMapper {
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "key", source = "key")
    @Mapping(target = "value", source = "value")
    PlantMaintenanceDetail toModel(PlantMaintenanceDetailDto d);
    
    List<PlantMaintenanceDetail> toModelList(List<PlantMaintenanceDetailDto> d);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "key", source = "key")
    @Mapping(target = "value", source = "value")
    PlantMaintenanceDetailDto toDto(PlantMaintenanceDetail d);
    
    List<PlantMaintenanceDetailDto> toDtoList(List<PlantMaintenanceDetail> d);
    
}
