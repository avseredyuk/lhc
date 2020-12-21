package com.avseredyuk.service;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.avseredyuk.dto.internal.SeasonDto;
import com.avseredyuk.exception.InconsistentDataException;
import com.avseredyuk.model.fruit.Crop;
import com.avseredyuk.model.fruit.Season;
import com.avseredyuk.repository.CropRepository;
import com.avseredyuk.repository.SeasonRepository;

@Service
public class CropService {

    @Autowired
    private DeviceService deviceService;
    @Autowired
    private SeasonRepository seasonRepository;
    @Autowired
    private CropRepository cropRepository;

    public Page<Season> findAllSeasonsByDeviceIdPaginated(Long deviceId, Pageable pageable) {
        return seasonRepository.findAllByDeviceIdOrderByIdDesc(deviceId, pageable);
    }

    public Page<Crop> findAllCropsBySeasonIdPaginated(Long seasonId, Pageable pageable) {
        return cropRepository.findAllBySeasonIdOrderByDateTimeDesc(seasonId, pageable);
    }

    public Season create(Season season) {
        if (season.getName() == null) {
            throw new InconsistentDataException("Invalid name value");
        }
        season.setDevice(
                deviceService.findById(season.getDevice().getId())
                        .orElseThrow(() -> new InconsistentDataException("Device not found")));
        if (Objects.nonNull(seasonRepository.findByNameAndDeviceId(season.getName(),
                season.getDevice().getId()))) {
            throw new InconsistentDataException("Non-unique name");
        }
        season.setCrops(
                cropRepository.findAllBySeasonId(season.getId()));

        return seasonRepository.save(season);
    }

    public Season update(Season season) {
        if (season.getName() == null) {
            throw new InconsistentDataException("Invalid name value");
        }
        season.setDevice(
                deviceService.findById(season.getDevice().getId())
                        .orElseThrow(() -> new InconsistentDataException("Device not found")));
        if (Objects.nonNull(seasonRepository.findByNameAndDeviceIdAndIdNot(season.getName(),
                season.getDevice().getId(), season.getId()))) {
            throw new InconsistentDataException("Non-unique name");
        }
        season.setCrops(
                cropRepository.findAllBySeasonId(season.getId()));

        return seasonRepository.save(season);
    }

    public Crop saveOrThrow(Crop crop) {
        if (crop.getWeight() == null) {
            throw new InconsistentDataException("Invalid weight value");
        }
        if (crop.getCount() == null) {
            throw new InconsistentDataException("Invalid count value");
        }
        crop.setSeason(
                seasonRepository.findById(crop.getSeason().getId())
                        .orElseThrow(() -> new InconsistentDataException("Season not found")));

        return cropRepository.save(crop);
    }

    public Season.SeasonName findSeasonNameById(Long seasonId) {
        return seasonRepository.findSeasonNameById(seasonId);
    }

    public Season findSeasonById(Long seasonId) {
        return seasonRepository.findSeasonById(seasonId);
    }

    public void deleteCrop(Long cropId) {
        cropRepository.delete(cropId);
    }

    public Crop findCropById(Long cropId) {
        return cropRepository.findOne(cropId);
    }

    public void deleteSeason(Long seasonId) {
        seasonRepository.delete(seasonId);
    }

    public SeasonDto.SeasonStatisticsDto findStatisticsById(Long seasonId) {
        Long countSum = cropRepository.countSumBySeasonId(seasonId);
        Double weightSum = cropRepository.weightSumBySeasonId(seasonId);
        if (countSum == null || weightSum == null) {
            return SeasonDto.SeasonStatisticsDto.builder()
                    .totalCount(0L)
                    .totalWeight(0.0d)
                    .avgCropWeight(0.0d)
                    .build();
        }
        return SeasonDto.SeasonStatisticsDto.builder()
                .totalCount(countSum)
                .totalWeight(weightSum)
                .avgCropWeight(weightSum / countSum)
                .build();
    }

    public SeasonDto.SeasonStatisticsDto findStatisticsByDeviceId(Long deviceId) {
        Long countSum = cropRepository.countSumByDeviceId(deviceId);
        Double weightSum = cropRepository.weightSumByDeviceId(deviceId);
        if (countSum == null || weightSum == null) {
            return SeasonDto.SeasonStatisticsDto.builder()
                    .totalCount(0L)
                    .totalWeight(0.0d)
                    .avgCropWeight(0.0d)
                    .build();
        }
        return SeasonDto.SeasonStatisticsDto.builder()
                .totalCount(countSum)
                .totalWeight(weightSum)
                .avgCropWeight(weightSum / countSum)
                .build();
    }
}
