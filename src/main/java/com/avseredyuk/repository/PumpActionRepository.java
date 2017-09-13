package com.avseredyuk.repository;

import com.avseredyuk.enums.PumpActionType;
import com.avseredyuk.model.PumpActionReport;
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
 * Created by lenfer on 9/13/17.
 */
@Repository
public class PumpActionRepository {
    private DataSource dataSource;
    
    @Autowired
    public PumpActionRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    public List<PumpActionReport> getLastReports() {
        ArrayList<PumpActionReport> result = new ArrayList<>();
        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM pump_actions ORDER BY date_time DESC LIMIT 20;")) {
            while (rs.next()) {
                PumpActionReport par = new PumpActionReport();
                par.setDateTime(rs.getTimestamp("date_time").toLocalDateTime());
                par.setActionType(PumpActionType.valueOf(rs.getString("action_type")));
                result.add(par);
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return result;
    }
    
    public void persist(PumpActionReport pumpActionReport) {
        try (Connection connection = dataSource.getConnection();
            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO pump_actions (action_type, date_time) VALUES (?, now());",
                Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, pumpActionReport.getActionType().toString());
            statement.executeUpdate();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
