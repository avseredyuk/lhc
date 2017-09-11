package com.avseredyuk.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * Created by lenfer on 9/8/17.
 */
@Data
public class SensorReport {
    @JsonFormat(
        shape = JsonFormat.Shape.STRING,
        pattern = "dd-MM-yyyy hh:mm:ss"
    )
    private LocalDateTime dateTime;
    private Double temperature;
    private Double humidity;
    private Double luminosity;
    private Double volume;
    private Double ppm;
}
