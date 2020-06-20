package com.avseredyuk.controller.admin;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.avseredyuk.dto.internal.CropDto;
import com.avseredyuk.dto.internal.SeasonDto;
import com.avseredyuk.mapper.internal.CropMapper;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.mapper.internal.SeasonMapper;
import com.avseredyuk.model.fruit.Crop;
import com.avseredyuk.model.fruit.Season;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.CropService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin/devices/{deviceId}/crop")
public class CropController {

    @Autowired
    private CropService cropService;
    @Autowired
    private SeasonMapper seasonMapper;
    @Autowired
    private CropMapper cropMapper;
    @Autowired
    private DeviceMapper deviceMapper;

    @GetMapping(value = "/seasons")
    public Page<SeasonDto> getAllSeasonsByDevice(@PathVariable Long deviceId,
                                                      @NotNull final Pageable pageable) {
        Page<Season> seasons = cropService.findAllSeasonsByDeviceIdPaginated(deviceId, pageable);
        return new PageImpl<>(seasonMapper.toDtoList(seasons.getContent()), pageable, seasons.getTotalElements());
    }

    @PostMapping(value = "/seasons", consumes = "application/json")
    public ResponseEntity<ApiResult<SeasonDto>> createSeason(@PathVariable Long deviceId,
                                                             @RequestBody SeasonDto seasonDto) {
        Season season = seasonMapper.toModel(seasonDto);
        season.setDevice(deviceMapper.toModelFromId(deviceId));
        return ResponseEntity.ok(new ApiResult<>(seasonMapper.toDto(cropService.saveOrThrow(season))));
    }

    @GetMapping(value = "/seasons/{seasonId}")
    public Page<CropDto> getAllSeasonsByDevice(@PathVariable Long deviceId,
                                                 @PathVariable Long seasonId,
                                                 @NotNull final Pageable pageable) {
        Page<Crop> crops = cropService.findAllCropsBySeasonIdPaginated(seasonId, pageable);
        return new PageImpl<>(cropMapper.toDtoList(crops.getContent()), pageable, crops.getTotalElements());
    }

    @GetMapping(value = "/seasons/{seasonId}/name")
    public ResponseEntity<ApiResult<SeasonDto>> getSeasonNameById(@PathVariable Long deviceId,
                                                                  @PathVariable Long seasonId) {
        return ResponseEntity.ok(new ApiResult<>(seasonMapper.toDtoNameOnly(cropService.findSeasonNameById(seasonId))));
    }

    @PostMapping(value = "/seasons/crop", consumes = "application/json")
    public ResponseEntity<ApiResult<CropDto>> createSeason(@PathVariable Long deviceId,
                                                           @RequestBody CropDto cropDto) {
        Crop crop = cropMapper.toModelCreate(cropDto);
        crop.setSeason(seasonMapper.toModelFromId(cropDto.getSeasonId()));
        return ResponseEntity.ok(new ApiResult<>(cropMapper.toDto(cropService.saveOrThrow(crop))));
    }

}
