package com.avseredyuk.service.internal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
public class CacheService {

    @Autowired
    private CacheManager cacheManager;

    public boolean clearCache() {
        for (String name : cacheManager.getCacheNames()) {
            System.out.println(name);
            cacheManager.getCache(name).clear();
        }
        return true;
    }
}
