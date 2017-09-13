package com.avseredyuk.model;

import com.avseredyuk.enums.PumpActionType;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * Created by lenfer on 9/13/17.
 */
@Data
public class PumpActionReport {
    private LocalDateTime dateTime;
    private PumpActionType actionType;
}
