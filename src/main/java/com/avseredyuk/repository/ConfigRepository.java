package com.avseredyuk.repository;

import com.avseredyuk.model.Config;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 1/7/18.
 */
@Repository
public interface ConfigRepository extends CrudRepository<Config, String> {
    
    List<Config> findAll();
    
}
