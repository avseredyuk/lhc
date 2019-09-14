package com.avseredyuk.model.internal;

import java.util.Arrays;
import java.util.List;
import lombok.Data;

@Data
public class ApiResult<T> {
    
    private T data;
    private List<String> errors;
    
    public ApiResult(T data) {
        super();
        this.data = data;
    }
    
    public ApiResult(String error) {
        super();
        errors = Arrays.asList(error);
    }
}
