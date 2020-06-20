CREATE SEQUENCE season_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE season (
    id bigint DEFAULT nextval('season_sq'::regclass) NOT NULL,
    name CHARACTER VARYING (1000) NOT NULL,
    device_id bigint NOT NULL
);
ALTER TABLE season ADD PRIMARY KEY (id);

CREATE SEQUENCE crop_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE crop (
    id bigint DEFAULT nextval('crop_sq'::regclass) NOT NULL,
    season_id bigint NOT NULL,
    weight DOUBLE PRECISION,
    crop_count DOUBLE PRECISION,
    date_time TIMESTAMP without time zone NOT NULL
);
ALTER TABLE crop ADD PRIMARY KEY (id);