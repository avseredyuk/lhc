package com.avseredyuk.model;

import com.avseredyuk.enums.PumpActionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * Created by lenfer on 9/13/17.
 */
@Data
public class PumpActionReport {
    @JsonFormat(
        shape = JsonFormat.Shape.STRING,
        pattern = "yyyy-MM-dd HH:mm:ss"
    )
    private LocalDateTime dateTime;
    private PumpActionType actionType;
}
