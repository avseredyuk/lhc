ALTER TABLE device_cfg
ADD COLUMN cfg_type character varying(1000);

UPDATE device_cfg SET cfg_type='DEVICE';

ALTER TABLE device_cfg ALTER COLUMN cfg_type SET NOT NULL;