package com.avseredyuk.repository;

import com.avseredyuk.model.IdentifiableEntity;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

/**
 * Created by lenfer on 9/20/17.
 */
public interface BackupableRepository<T> {
    DataSource getDataSource();
    String getTableName();
    List<T> parseResultSet(ResultSet rs);
    
    default Integer countAllSuitableForBackUp() {
        Integer result = 0;
        try (Connection connection = getDataSource().getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(String.format("SELECT COUNT(*) FROM %s WHERE date_time < NOW() - '1 day'::INTERVAL;", getTableName()))) {
            
            rs.next();
            result = rs.getInt(1);
            
        } catch (SQLException e) {
            System.out.println(e);
        }
        return result;
    }
    
    default List<T> findAllSuitableForBackup() {
        ArrayList<T> result = new ArrayList<>();
        try (Connection connection = getDataSource().getConnection();
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(String.format("SELECT * FROM %s WHERE date_time < NOW() - '1 day'::INTERVAL ORDER BY date_time ASC;", getTableName()))) {
            
            result.addAll(parseResultSet(rs));
            
        } catch (SQLException e) {
            System.out.println(e);
        }
        return result;
    }
    
    default boolean delete(IdentifiableEntity entity) {
        try (Connection connection = getDataSource().getConnection();
            Statement stmt = connection.createStatement()) {
            
            stmt.executeUpdate(String.format("DELETE FROM %s WHERE id = %d", getTableName(), entity.getId()));
                
            return true;
            
        } catch (SQLException e) {
            System.out.println(e);
        }
        return false;
    }
}
