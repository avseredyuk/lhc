package com.avseredyuk.repository;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;

/**
 * Created by lenfer on 1/6/18.
 */
public interface CleanableRepository {
    DataSource getDataSource();
    String getTableName();
    
    default void cleanUp() {
        try (Connection connection = getDataSource().getConnection();
            Statement stmt = connection.createStatement()) {
            stmt.executeUpdate(String.format("DELETE FROM %s WHERE date_time < NOW() - '21 days'::INTERVAL;", getTableName()));
        } catch (SQLException e) {
            System.out.println(e);
        }
    }
}
