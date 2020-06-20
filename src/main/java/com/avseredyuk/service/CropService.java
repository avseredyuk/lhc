package com.avseredyuk.service;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
        return cropRepository.findAllBySeasonIdOrderByIdDesc(seasonId, pageable);
    }

    public Season saveOrThrow(Season season) {
        if (season.getName() == null) {
            throw new InconsistentDataException("Invalid name value");
        }
        if (Objects.nonNull(seasonRepository.findByName(season.getName()))) {
            throw new InconsistentDataException("Non-unique name");
        }
        season.setDevice(
                deviceService.findById(season.getDevice().getId())
                        .orElseThrow(() -> new InconsistentDataException("Device not found")));

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
}
