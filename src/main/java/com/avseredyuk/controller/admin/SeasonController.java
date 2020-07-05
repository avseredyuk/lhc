package com.avseredyuk.controller.admin;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.avseredyuk.dto.internal.SeasonDto;
import com.avseredyuk.mapper.internal.CropMapper;
import com.avseredyuk.mapper.internal.DeviceMapper;
import com.avseredyuk.mapper.internal.SeasonMapper;
import com.avseredyuk.model.fruit.Season;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.CropService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin")
public class SeasonController {

    @Autowired
    private CropService cropService;
    @Autowired
    private SeasonMapper seasonMapper;
    @Autowired
    private CropMapper cropMapper;
    @Autowired
    private DeviceMapper deviceMapper;

    @PostMapping(value = "/season", consumes = "application/json")
    public ResponseEntity<ApiResult<SeasonDto>> createSeason(@RequestBody SeasonDto seasonDto) {
        Season season = seasonMapper.toModel(seasonDto);
        season.setDevice(deviceMapper.toModelFromId(seasonDto.getDeviceId()));
        return ResponseEntity.ok(new ApiResult<>(seasonMapper.toDto(cropService.create(season))));
    }

    @GetMapping(value = "/season")
    public Page<SeasonDto> getSeasonsByDevice(@RequestParam Long deviceId,
                                              @NotNull final Pageable pageable) {
        Page<Season> seasons = cropService.findAllSeasonsByDeviceIdPaginated(deviceId, pageable);
        return new PageImpl<>(seasonMapper.toDtoList(seasons.getContent()), pageable, seasons.getTotalElements());
    }

    @GetMapping(value = "/season/{seasonId}/name")
    public ResponseEntity<ApiResult<SeasonDto>> getSeasonNameById(@PathVariable Long seasonId) {
        return ResponseEntity.ok(new ApiResult<>(seasonMapper.toDtoNameOnly(cropService.findSeasonNameById(seasonId))));
    }

    @GetMapping(value = "/season/{seasonId}/stats")
    public ResponseEntity<ApiResult<SeasonDto.SeasonStatisticsDto>> getSeasonStatisticsById(@PathVariable Long seasonId) {
        return ResponseEntity.ok(new ApiResult<>(cropService.findStatisticsById(seasonId)));
    }

    @GetMapping(value = "/season/{seasonId}")
    public ResponseEntity<ApiResult<SeasonDto>> getSeasonById(@PathVariable Long seasonId) {
        return ResponseEntity.ok(new ApiResult<>(seasonMapper.toDto(cropService.findSeasonById(seasonId))));
    }

    @PutMapping(
            value = "/season/{seasonId}",
            consumes = "application/json"
    )
    public void updateSeason(@PathVariable Long seasonId,
                             @RequestBody SeasonDto seasonDto) {
        Season season = seasonMapper.toModel(seasonDto);
        season.setDevice(deviceMapper.toModelFromId(seasonDto.getDeviceId()));
        cropService.update(season);
    }

    @DeleteMapping(value = "/season/{seasonId}")
    public void deleteSeason(@PathVariable Long seasonId) {
        cropService.deleteSeason(seasonId);
    }
}
