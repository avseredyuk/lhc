package com.avseredyuk.repository;

import com.avseredyuk.model.SensorReport;
import java.sql.Connection;
import java.sql.PreparedStatement;
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
    private DataSource dataSource;
    
    @Autowired
    public SensorReportRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    public List<SensorReport> getLastReports() {
        ArrayList<SensorReport> result = new ArrayList<>();
        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM reports WHERE date_time >= NOW() - '1 day'::INTERVAL ORDER BY date_time DESC;")) {
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
    
    public void persist(SensorReport report) {
        try (Connection connection = dataSource.getConnection();
            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO reports (temperature, humidity, luminosity, volume, ppm, date_time) VALUES (?, ?, ?, ?, ?, now());",
                Statement.RETURN_GENERATED_KEYS)) {
            statement.setDouble(1, report.getTemperature());
            statement.setDouble(2, report.getHumidity());
            statement.setDouble(3, report.getLuminosity());
            statement.setDouble(4, report.getVolume());
            statement.setDouble(5, report.getPpm());
            statement.executeUpdate();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
    
}
