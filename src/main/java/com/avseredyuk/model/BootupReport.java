package com.avseredyuk.model;

import java.time.LocalDateTime;
import lombok.Data;

/**
 * Created by lenfer on 10/9/17.
 */
@Data
public class BootupReport extends IdentifiableEntity {
    private LocalDateTime dateTime;
}
