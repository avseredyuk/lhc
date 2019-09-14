UPDATE sensor_report
SET abs_humidity = ROUND(216.7 * ( humidity / 100 ) * 6.112 * EXP(17.62 * temperature / (243.12 + temperature)) / (273.15 + temperature), 2)
WHERE abs_humidity IS NULL and humidity > 0 AND temperature > 0;

UPDATE sensor_report
SET abs_humidity = 0.00
WHERE abs_humidity IS NULL and humidity = 0.00 AND temperature = 0.00;