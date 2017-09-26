package com.avseredyuk.service;

import static java.util.Arrays.asList;

import com.avseredyuk.enums.ReportType;
import com.avseredyuk.gdrive.UploaderRepository;
import com.avseredyuk.model.PumpActionReport;
import com.avseredyuk.model.SensorReport;
import com.avseredyuk.repository.PumpActionRepository;
import com.avseredyuk.repository.SensorReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Created by lenfer on 9/20/17.
 */
@Service
public class BackupService {
    private static final String REPORT_FILENAME_DATETIME_FORMAT = "yyyy_MM_dd_HH_mm_ss";
    private static final String REPORT_FILENAME_FORMAT = "%s_%s.json";
    private static final String TMP_DIR = "/tmp";
    
    @Value("${gdrive.upload.data.limit}")
    private Integer uploadDataLimit;
    
    @Value("${gdrive.upload.enabled}")
    private String gdriveUploadEnabled;
    
    private SensorReportRepository sensorReportRepository;
    private PumpActionRepository pumpActionRepository;
    private UploaderRepository uploaderRepository;
    
    @Autowired
    public BackupService(SensorReportRepository sensorReportRepository,
        PumpActionRepository pumpActionRepository, UploaderRepository uploaderRepository) {
        this.sensorReportRepository = sensorReportRepository;
        this.pumpActionRepository = pumpActionRepository;
        this.uploaderRepository = uploaderRepository;
    }
    
    public void checkAndBackup() {
        boolean enabled = Boolean.parseBoolean(gdriveUploadEnabled);
        if (enabled) {
            Integer suitableSRForBackupCount = sensorReportRepository.countAllSuitableForBackUp();
            Integer suitablePARForBackupCount = pumpActionRepository.countAllSuitableForBackUp();
    
            if ((suitableSRForBackupCount + suitablePARForBackupCount) > uploadDataLimit) {
                List<SensorReport> sensorReports = sensorReportRepository.findAllSuitableForBackup();
                List<PumpActionReport> pumpActions = pumpActionRepository.findAllSuitableForBackup();
        
                backUp(sensorReports, pumpActions);
            }
        }
    }
    
    private void backUp(List<SensorReport> sensorReports, List<PumpActionReport> pumpActions) {
        String sensorFilename = formatFileName(ReportType.SENSOR);
        String pumpFilename = formatFileName(ReportType.PUMP);
        toFile(toJson(sensorReports), sensorFilename);
        toFile(toJson(pumpActions), pumpFilename);
        
        File tmpDirectory = new File(TMP_DIR);
        tmpDirectory.mkdir();
        File sensorFile = new File(TMP_DIR, sensorFilename);
        File pumpFile = new File(TMP_DIR, pumpFilename);
    
        List<Boolean> results = uploaderRepository.uploadBatch(asList(sensorFile, pumpFile));
        if ((results != null) && (results.size() == 2)) {
            if (results.get(0)) {
                sensorReports.forEach(r -> sensorReportRepository.delete(r));
            }
            if (results.get(1)) {
                pumpActions.forEach(r -> pumpActionRepository.delete(r));
            }
        }
        
    }
    
    private String formatFileName(ReportType reportType) {
        return String.format(REPORT_FILENAME_FORMAT, reportType.toString(),
            DateTimeFormatter.ofPattern(REPORT_FILENAME_DATETIME_FORMAT).format(LocalDateTime.now()));
    }
    
    private String toJson(Object o) {
        try {
            final StringWriter sw = new StringWriter();
            final ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(sw, o);
            return sw.toString();
        } catch (IOException e) {
            System.out.println(e);
        }
        return "";
    }
    
    private void toFile(String content, String filename) {
        try (FileWriter fw = new FileWriter(filename)) {
            fw.write(content);
            fw.close();
        } catch (IOException e) {
            System.out.println(e);
        }
    }
    
}
