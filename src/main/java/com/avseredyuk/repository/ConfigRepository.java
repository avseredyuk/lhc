package com.avseredyuk.repository;

import com.avseredyuk.model.Config;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigRepository extends CrudRepository<Config, String> {

    Page<Config> findAll(Pageable pageable);
    Optional<Config> findByKey(String key);

}
