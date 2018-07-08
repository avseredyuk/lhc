package com.avseredyuk.repository;

import com.avseredyuk.model.EspDevice;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 6/16/18.
 */
@Repository
public interface EspAuthRepository extends CrudRepository<EspDevice, String> {
    
    EspDevice findByToken(String token);
    
}
