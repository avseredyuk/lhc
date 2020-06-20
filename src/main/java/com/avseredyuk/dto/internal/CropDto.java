package com.avseredyuk.dto.internal;

import java.util.Date;

import lombok.Data;

@Data
public class CropDto {
    private Long id;
    private Double weight;
    private Double count;
    private Date dateTime;
    private Long seasonId;
}
