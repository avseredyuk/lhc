package com.avseredyuk.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.avseredyuk.model.fruit.Crop;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

    Page<Crop> findAllBySeasonIdOrderByIdDesc(Long seasonId, Pageable pageable);

}
