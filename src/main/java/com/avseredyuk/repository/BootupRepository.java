package com.avseredyuk.repository;

import com.avseredyuk.model.BootupReport;
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
 * Created by lenfer on 10/9/17.
 */
@Repository
public class BootupRepository implements BackupableRepository<BootupReport> {
    private DataSource dataSource;
    
    @Autowired
    public BootupRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    @Override
    public DataSource getDataSource() {
        return dataSource;
    }
    
    @Override
    public String getTableName() {
        return "bootup";
    }
    
    public List<BootupReport> getLastReports() {
        List<BootupReport> result = new ArrayList<>();
        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM bootup ORDER BY date_time DESC LIMIT 5;")) {
        
            result.addAll(parseResultSet(rs));
        
        } catch (SQLException e) {
            System.out.println(e);
        }
        return result;
    }
    
    public void newBoot() {
        try (Connection connection = dataSource.getConnection();
            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO bootup (date_time) VALUES (now());",
                Statement.RETURN_GENERATED_KEYS)) {
            
            statement.executeUpdate();
        
        } catch (SQLException e) {
            System.out.println(e);
        }
    }
    
    @Override
    public List<BootupReport> parseResultSet(ResultSet rs) {
        List<BootupReport> result = new ArrayList<>();
        try {
            while (rs.next()) {
                BootupReport br = new BootupReport();
                br.setId(rs.getLong("id"));
                br.setDateTime(rs.getTimestamp("date_time").toLocalDateTime());
                result.add(br);
            }
        } catch (SQLException e) {
            System.out.println(e);
        }
        return result;
    }
}
