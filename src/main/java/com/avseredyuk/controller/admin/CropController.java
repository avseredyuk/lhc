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

import com.avseredyuk.dto.internal.CropDto;
import com.avseredyuk.mapper.internal.CropMapper;
import com.avseredyuk.mapper.internal.SeasonMapper;
import com.avseredyuk.model.fruit.Crop;
import com.avseredyuk.model.internal.ApiResult;
import com.avseredyuk.service.CropService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/admin")
public class CropController {

    @Autowired
    private CropService cropService;
    @Autowired
    private SeasonMapper seasonMapper;
    @Autowired
    private CropMapper cropMapper;

    @PostMapping(value = "/crop", consumes = "application/json")
    public ResponseEntity<ApiResult<CropDto>> createCrop(@RequestBody CropDto cropDto) {
        Crop crop = cropMapper.toModelCreate(cropDto);
        crop.setSeason(seasonMapper.toModelFromId(cropDto.getSeasonId()));
        return ResponseEntity.ok(new ApiResult<>(cropMapper.toDto(cropService.saveOrThrow(crop))));
    }

    @DeleteMapping(value = "/crop/{cropId}")
    public void deleteCrop(@PathVariable Long cropId) {
        cropService.deleteCrop(cropId);
    }

    @GetMapping(value = "/crop/{cropId}")
    public ResponseEntity<ApiResult<CropDto>> getCropById(@PathVariable Long cropId) {
        return ResponseEntity.ok(new ApiResult<>(cropMapper.toDto(cropService.findCropById(cropId))));
    }

    @PutMapping(
            value = "/crop/{cropId}",
            consumes = "application/json"
    )
    public void updateCrop(@PathVariable Long cropId,
                           @RequestBody CropDto cropDto) {
        Crop crop = cropMapper.toModelUpdate(cropDto);
        crop.setSeason(seasonMapper.toModelFromId(cropDto.getSeasonId()));
        cropService.saveOrThrow(crop);
    }

    @GetMapping(value = "/crop")
    public Page<CropDto> getCropsBySeasonId(@RequestParam Long seasonId,
                                            @NotNull final Pageable pageable) {
        Page<Crop> crops = cropService.findAllCropsBySeasonIdPaginated(seasonId, pageable);
        return new PageImpl<>(cropMapper.toDtoList(crops.getContent()), pageable, crops.getTotalElements());
    }

}
