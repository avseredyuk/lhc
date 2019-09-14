CREATE SEQUENCE plant_maintenance_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE plant_maintenance (
    id bigint DEFAULT nextval('plant_maintenance_sq'::regclass) NOT NULL,
    device_id bigint NOT NULL,
    date_time TIMESTAMP without time zone NOT NULL,
    maintenance_type CHARACTER VARYING(64) NOT NULL,
    ph NUMERIC(7,2) NOT NULL,
    tds NUMERIC(7,2) NOT NULL
);

ALTER TABLE plant_maintenance ADD PRIMARY KEY (id);

CREATE SEQUENCE plant_maintenance_detail_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE plant_maintenance_detail (
    id bigint DEFAULT nextval('plant_maintenance_detail_sq'::regclass) NOT NULL,
    plant_maintenance_id bigint NOT NULL,
    detail_key CHARACTER VARYING(1000) NOT NULL,
    detail_value CHARACTER VARYING(1000) NOT NULL
);

ALTER TABLE plant_maintenance_detail ADD PRIMARY KEY (id);