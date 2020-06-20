package com.avseredyuk.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.avseredyuk.model.fruit.Season;

@Repository
public interface SeasonRepository extends JpaRepository<Season, Long> {

    Page<Season> findAllByDeviceIdOrderByIdDesc(Long deviceId, Pageable pageable);

    Season.SeasonName findSeasonNameById(Long seasonId);

    Optional<Season> findById(Long id);

    Season findByName(String name);

}
