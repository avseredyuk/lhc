package com.avseredyuk.mapper.internal;

import com.avseredyuk.dto.internal.PlantMaintenanceDto;
import com.avseredyuk.model.PlantMaintenance;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface PlantMaintenanceMapper {
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "d", expression = "java(p.getDateTime().getTime())")
    @Mapping(target = "deviceId", source = "device.id")
    @Mapping(target = "maintenanceType", source = "maintenanceType")
    @Mapping(target = "ph", source = "ph")
    @Mapping(target = "tds", source = "tds")
    PlantMaintenanceDto toDto(PlantMaintenance p);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "maintenanceType", source = "maintenanceType")
    @Mapping(target = "ph", source = "ph")
    @Mapping(target = "tds", source = "tds")
    PlantMaintenance toModelCreate(PlantMaintenanceDto p);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "maintenanceType", source = "maintenanceType")
    @Mapping(target = "ph", source = "ph")
    @Mapping(target = "tds", source = "tds")
    @Mapping(target = "dateTime", expression = "java(new java.util.Date(p.getD()))")
    PlantMaintenance toModelUpdate(PlantMaintenanceDto p);
    
    List<PlantMaintenanceDto> toDtoList(List<PlantMaintenance> p);
}
