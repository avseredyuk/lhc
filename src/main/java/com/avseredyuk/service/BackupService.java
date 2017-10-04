package com.avseredyuk.service;

import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.BackupRepository;
import com.avseredyuk.repository.PumpActionRepository;
import com.avseredyuk.repository.SensorReportRepository;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 9/20/17.
 */
@Service
public class BackupService {
    private static final String SR_REPORT_FORMAT = "%s,%s,%s,%s,%s,%s|";
    private static final String PAR_REPORT_FORMAT = "%s,%d|";
    
    private SensorReportRepository sensorReportRepository;
    private PumpActionRepository pumpActionRepository;
    private BackupRepository backupRepository;
    
    @Value("${backup.threshold}")
    private Integer backupThreshold;
    @Value("${backup.enabled}")
    private boolean backupEnabled;
    
    @Autowired
    public BackupService(SensorReportRepository sensorReportRepository,
        PumpActionRepository pumpActionRepository, BackupRepository backupRepository) {
        this.sensorReportRepository = sensorReportRepository;
        this.pumpActionRepository = pumpActionRepository;
        this.backupRepository = backupRepository;
    }
    
    public synchronized void checkAndBackup() {
        if (backupEnabled) {
            long buStart = System.currentTimeMillis();
            
            Integer suitableSRForBackupCount = sensorReportRepository.countAllSuitableForBackUp();
            Integer suitablePARForBackupCount = pumpActionRepository.countAllSuitableForBackUp();
            
            if ((suitableSRForBackupCount + suitablePARForBackupCount) > backupThreshold) {
                List<SensorReport> sensorReports = sensorReportRepository.findAllSuitableForBackup();
                List<PumpActionReport> pumpActions = pumpActionRepository.findAllSuitableForBackup();
        
                backUp(sensorReports, pumpActions);
                
                sensorReports.forEach(sensorReportRepository::delete);
                pumpActions.forEach(pumpActionRepository::delete);
            }
            
            long buEnd = System.currentTimeMillis();
            System.out.println(String.format("Total items backed up: %d", suitableSRForBackupCount + suitablePARForBackupCount));
            System.out.println(String.format("Time took: %s", buEnd - buStart));
        }
    }
    
    private void backUp(List<SensorReport> sensorReports, List<PumpActionReport> pumpActions) {
        StringBuilder sensorSB = new StringBuilder(160000);
        for (int i = 0; i < sensorReports.size(); i++) {
            SensorReport sr = sensorReports.get(i);
            SensorReport prevSr = i > 0 ? sensorReports.get(i - 1) : null;
            sensorSB.append(printSensorReport(sr, prevSr));
        }
        
        StringBuilder pumpSB = new StringBuilder(4000);
        for (int i = 0; i < pumpActions.size(); i++) {
            PumpActionReport par = pumpActions.get(i);
            PumpActionReport prevPar = i > 0 ? pumpActions.get(i - 1) : null;
            pumpSB.append(printPumpReport(par, prevPar));
        }
        
        backupRepository.persist(sensorSB.toString(), pumpSB.toString());
    }
    
    private String printPumpReport(PumpActionReport par, PumpActionReport prevPar) {
        if (prevPar == null) {
            return String.format(PAR_REPORT_FORMAT,
                Long.toHexString(Timestamp.valueOf(par.getDateTime()).getTime() / 10),
                par.getActionType().ordinal()
            );
        } else {
            return String.format(PAR_REPORT_FORMAT,
                Long.toHexString((Timestamp.valueOf(par.getDateTime()).getTime() - Timestamp.valueOf(prevPar.getDateTime()).getTime()) / 10),
                par.getActionType().ordinal()
            );
        }
    }
    
    private String printSensorReport(SensorReport sr, SensorReport prevSr) {
        if (prevSr == null) {
            return String.format(SR_REPORT_FORMAT,
                Long.toHexString(Timestamp.valueOf(sr.getDateTime()).getTime() / 10),
                formatDouble(sr.getHumidity()),
                formatDouble(sr.getPpm()),
                formatDouble(sr.getTemperature()),
                formatDouble(sr.getVolume()),
                formatDouble(sr.getWaterTemperature())
            );
        } else {
            return String.format(SR_REPORT_FORMAT,
                Long.toHexString((Timestamp.valueOf(sr.getDateTime()).getTime() - Timestamp.valueOf(prevSr.getDateTime()).getTime()) / 10),
                formatDouble(sr.getHumidity() - prevSr.getHumidity()),
                formatDouble(sr.getPpm() - prevSr.getPpm()),
                formatDouble(sr.getTemperature() - prevSr.getTemperature()),
                formatDouble(sr.getVolume() - prevSr.getVolume()),
                formatDouble(sr.getWaterTemperature() - prevSr.getWaterTemperature())
            );
        }
    }
    
    private String formatDouble(Double d) {
        String formattedDouble = new DecimalFormat("#.##", DecimalFormatSymbols.getInstance( Locale.ENGLISH )).format(d);
        return "0".equals(formattedDouble) ? "" : formattedDouble;
    }
    
}
