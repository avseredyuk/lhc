package com.avseredyuk.repository;

import com.avseredyuk.model.SensorReport;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 9/9/17.
 */
@Repository
public class SensorReportRepository {
    @Autowired
    private DataSource dataSource;
    
    public List<SensorReport> getLastReports() {
        
        ArrayList<SensorReport> result = new ArrayList<>();
        
        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM reports ORDER BY date_time DESC LIMIT 20;")) {
            
            while (rs.next()) {
                SensorReport sr = new SensorReport();
                sr.setTemperature(rs.getDouble("temperature"));
                sr.setHumidity(rs.getDouble("humidity"));
                sr.setLuminosity(rs.getDouble("luminosity"));
                sr.setVolume(rs.getDouble("volume"));
                sr.setPpm(rs.getDouble("ppm"));
                sr.setDateTime(rs.getTimestamp("date_time").toLocalDateTime());
                result.add(sr);
            }
            
        } catch (Exception e) {
            System.out.println(e);
        }
    
        return result;
    }
    
}
