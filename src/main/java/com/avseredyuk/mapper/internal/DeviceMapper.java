package com.avseredyuk.mapper.internal;

import com.avseredyuk.dto.internal.DeviceDto;
import com.avseredyuk.dto.internal.DeviceDto.DeviceReportDataExclusionDto;
import com.avseredyuk.model.Device;
import com.avseredyuk.model.DeviceReportDataExclusion;
import com.avseredyuk.model.DeviceReportDataExclusion.ReportDataType;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface DeviceMapper {
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "enabled", source = "enabled")
    @Mapping(target = "config", source = "config")
    DeviceDto toDto(Device d);
    
    List<DeviceDto> toDtoList(List<Device> d);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "enabled", source = "enabled")
    Device toModel(DeviceDto d);
    
    @AfterMapping
    default void mapExclusionsPresence(Device source, @MappingTarget DeviceDto target) {
        Set<ReportDataType> excludedTypesList = new HashSet<>();
        if (source.getExclusions() != null) {
            excludedTypesList.addAll(
                source.getExclusions().stream().map(DeviceReportDataExclusion::getMap).collect(Collectors.toSet()));
        }
        target.setExclusions(
            Stream.of(DeviceReportDataExclusion.ReportDataType.values())
                .map(reportDataType -> {
                    DeviceReportDataExclusionDto dto = new DeviceReportDataExclusionDto();
                    dto.setMap(reportDataType.name());
                    dto.setExcluded(excludedTypesList.contains(reportDataType));
                    return dto;
                })
                .collect(Collectors.toList())
        );
    }
    
    
    @Mapping(target = "token", source = "deviceToken")
    Device toModelFromToken(String deviceToken);
    
    @Mapping(target = "id", source = "deviceId")
    Device toModelFromId(Long deviceId);
    
}