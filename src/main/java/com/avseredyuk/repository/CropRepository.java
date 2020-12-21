package com.avseredyuk.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.avseredyuk.model.fruit.Crop;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

    Page<Crop> findAllBySeasonIdOrderByDateTimeDesc(Long seasonId, Pageable pageable);

    List<Crop> findAllBySeasonId(Long seasonId);

    @Query("select sum(c.count) from Crop c where c.season.id = ?1")
    Long countSumBySeasonId(Long seasonId);

    @Query("select sum(c.weight) from Crop c where c.season.id = ?1")
    Double weightSumBySeasonId(Long seasonId);

    @Query("select sum(c.count) from Crop c " +
            "join c.season s " +
            "where c.season.device.id = ?1")
    Long countSumByDeviceId(Long deviceId);

    @Query("select sum(c.weight) from Crop c " +
            "join c.season " +
            "where c.season.device.id = ?1")
    Double weightSumByDeviceId(Long deviceId);

}
