CREATE TABLE pings (
    date_time timestamp without time zone,
    device_id bigint,
    PRIMARY KEY(date_time, device_id)
);