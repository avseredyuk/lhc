package com.avseredyuk.dto.internal;

import lombok.Data;

@Data
public class PumpActionDto {
    private Long id;
    private Long dateTime;
    private String action;
}
