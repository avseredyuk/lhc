package com.avseredyuk.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Created by lenfer on 9/29/17.
 */
@Repository
public class BackupRepository {
    private DataSource dataSource;
    
    @Autowired
    public BackupRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    public void persist(String reportString, String pumpString) {
        try (Connection connection = dataSource.getConnection();
            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO backup (date_time, report_data, pump_data) VALUES (now(), ?, ?);",
                Statement.RETURN_GENERATED_KEYS)) {
        
            statement.setString(1, reportString);
            statement.setString(2, pumpString);
            statement.executeUpdate();
        
        } catch (SQLException e) {
            System.out.println(e);
        }
    }
    
}
