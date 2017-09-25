package com.avseredyuk.dto;

import lombok.Data;

/**
 * Created by lenfer on 9/15/17.
 */
@Data
public class SensorReportDto {
    private Long d;
    private double t;
    private double h;
    private double l;
    private double v;
    private double p;
}
