package com.avseredyuk.repository;

import com.avseredyuk.model.Config;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigRepository extends CrudRepository<Config, String> {

    List<Config> findAll();
    Optional<Config> findByKey(String key);

}
