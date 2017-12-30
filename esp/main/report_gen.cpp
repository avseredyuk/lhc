#include <DallasTemperature.h>
#include <DHT.h>
#include "context.h"
#include "pins.h"
#include "struct.h"

DHT dht(DHTPin, DHT22);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

void report_gen_init() {
  dht.begin();
}

float getWaterTemp() {
  float temp = 0.0;
  long i = 0;
  do {
    Serial.println("Retry #" + String(i) + ": get water temperature");
    DS18B20.requestTemperatures();
    temp = DS18B20.getTempCByIndex(0);
    i++;
  } while ((temp == 85.0 || temp == (-127.0)) && (i < 10));
  return temp;
}

BootupPackage getBootupReport() {
  BootupPackage p;
  p.record.type = 1;
  p.record.datetime = millis();
  return p;
}

PumpPackage getPumpReport() {
  PumpPackage p;
  p.record.type = 2;
  p.record.datetime = millis();
  p.record.enabled = pumpEnabled;
  return p;
}

SensorPackage getSensorsReport() {
  SensorPackage p;
  p.record.type = 3;
  p.record.datetime = millis();
  p.record.humidity = dht.readHumidity();
  p.record.temperature = dht.readTemperature();
  p.record.water_temperature = getWaterTemp();
  return p;
}

