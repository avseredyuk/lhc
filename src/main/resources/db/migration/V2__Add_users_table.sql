CREATE SEQUENCE users_sq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE users (
    id bigint DEFAULT nextval('users_sq'::regclass) NOT NULL,
    username CHARACTER VARYING (128) NOT NULL,
    password CHARACTER VARYING (128) NOT NULL
);