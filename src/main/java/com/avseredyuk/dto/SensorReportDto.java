package com.avseredyuk.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * Created by lenfer on 9/15/17.
 */
@Data
public class SensorReportDto {
    @JsonFormat(
        shape = JsonFormat.Shape.STRING,
        pattern = "yyyy-MM-dd HH:mm:ss"
    )
    private LocalDateTime d;
    private double t;
    private double h;
    private double l;
    private double v;
    private double p;
}
