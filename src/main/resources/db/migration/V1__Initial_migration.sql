CREATE SEQUENCE bootup_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE bootup (
    id bigint DEFAULT nextval('bootup_sq'::regclass) NOT NULL,
    date_time timestamp without time zone,
    device_id bigint
);

CREATE TABLE cfg (
    cfg_key character varying(1000) NOT NULL,
    cfg_value character varying(1000)
);

CREATE SEQUENCE device_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE device (
    id bigint DEFAULT nextval('device_sq'::regclass) NOT NULL,
    token text,
    device_name text,
    enabled boolean
);

CREATE SEQUENCE device_cfg_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE device_cfg (
    id bigint DEFAULT nextval('device_cfg_sq'::regclass) NOT NULL,
    cfg_key character varying(1000) NOT NULL,
    cfg_value character varying(1000) NOT NULL,
    device_id bigint NOT NULL
);

CREATE SEQUENCE device_report_data_exclusion_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE device_report_data_exclusion (
    id bigint DEFAULT nextval('device_report_data_exclusion_sq'::regclass) NOT NULL,
    device_id bigint NOT NULL,
    map character varying(100) NOT NULL
);

CREATE SEQUENCE pump_action_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE pump_action (
    id bigint DEFAULT nextval('pump_action_sq'::regclass) NOT NULL,
    action_type character varying(64),
    date_time timestamp without time zone,
    device_id bigint
);

CREATE SEQUENCE sensor_report_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE sensor_report (
    id bigint DEFAULT nextval('sensor_report_sq'::regclass) NOT NULL,
    temperature numeric(7,2),
    humidity numeric(7,2),
    date_time timestamp without time zone,
    water_temperature numeric(7,2),
    device_id bigint
);