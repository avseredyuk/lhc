package com.avseredyuk.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@Table(name = "pings")
@IdClass(Ping.PingPK.class)
public class Ping {

    @Id
    @Column(name = "date_time")
    private Date dateTime;

    @Id
    @Column(name = "device_id")
    private Long deviceId;

    @PrePersist
    public void initDateTime() {
        this.dateTime = new Date();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PingPK implements Serializable {
        private Date dateTime;
        private Long deviceId;
    }
}
