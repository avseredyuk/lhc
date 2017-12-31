package com.avseredyuk.repository;

import com.avseredyuk.model.SensorReport;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
        List<SensorReport> result = new ArrayList<>();
        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM reports WHERE date_time >= now() - '1 day'::INTERVAL ORDER BY date_time DESC;")) {
            
            result.addAll(parseResultSet(rs));
            
        } catch (SQLException e) {
            System.out.println(e);
        }
        return result;
    }
    
    public SensorReport getLastReport() {
        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM reports ORDER BY date_time DESC LIMIT 1;")) {
            return parseResultSet(rs).get(0);
        } catch (SQLException e) {
            System.out.println(e);
        }
        //todo: it stinks
        return null;
    }
    
    public void persist(SensorReport report) {
        try (Connection connection = dataSource.getConnection();
            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO reports (temperature, water_temperature, humidity, volume, ppm, date_time) VALUES (?, ?, ?, ?, ?, now());",
                Statement.RETURN_GENERATED_KEYS)) {
            
            statement.setDouble(1, report.getTemperature());
            statement.setDouble(2, report.getWaterTemperature());
            statement.setDouble(3, report.getHumidity());
            statement.setDouble(4, report.getVolume());
            statement.setDouble(5, report.getPpm());
            statement.executeUpdate();
            
        } catch (SQLException e) {
            System.out.println(e);
        }
    }
    
    public List<SensorReport> parseResultSet(ResultSet rs) {
        List<SensorReport> result = new ArrayList<>();
        try {
            while (rs.next()) {
                SensorReport sr = new SensorReport();
                sr.setId(rs.getLong("id"));
                sr.setTemperature(rs.getDouble("temperature"));
                sr.setWaterTemperature(rs.getDouble("water_temperature"));
                sr.setHumidity(rs.getDouble("humidity"));
                sr.setVolume(rs.getDouble("volume"));
                sr.setPpm(rs.getDouble("ppm"));
                sr.setDateTime(rs.getTimestamp("date_time").toLocalDateTime());
                result.add(sr);
            }
        } catch (SQLException e) {
            System.out.println(e);
        }
        return result;
    }
}
