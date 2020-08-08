#include <DallasTemperature.h>
#include <DHT.h>
#include "context.h"
#include "struct.h"
#include <stdlib.h>

DHT* dht = NULL;
OneWire* oneWire = NULL;
DallasTemperature* DS18B20 = NULL;

void report_gen_init() {
  if (CFG.airTempHumidityPin >= 0) {
    dht = new DHT(CFG.airTempHumidityPin, DHT22);
    dht->begin(); 
  }
  if (CFG.waterTempPin >= 0) {
    oneWire = new OneWire(CFG.waterTempPin);
    DS18B20 = new DallasTemperature(oneWire);
  }
}

BootupPackage getBootupReport() {
  BootupPackage p;
  p.record.datetime = millis();
  return p;
}

PumpPackage getPumpReport() {
  PumpPackage p;
  p.record.datetime = millis();
  p.record.enabled = pumpEnabled;
  return p;
}

float getWaterTemp() {
  float temp = 0.0;
  long i = 0;
  do {
    Serial.println("   * Retry #" + String(i) + ": get water temperature");
    DS18B20->requestTemperatures();
    temp = DS18B20->getTempCByIndex(0);
    i++;
  } while ((temp == 85.0 || temp == (-127.0)) && (i < 10));
  return temp;
}

SensorPackage getSensorsReport() {
  SensorPackage p;
  p.record.datetime = millis();
  if (CFG.airTempHumidityPin >= 0) {
    p.record.humidity = dht->readHumidity();
    p.record.temperature = dht->readTemperature();
  } else {
    p.record.humidity = 0.0;
    p.record.temperature = 0.0;
  }
  if (CFG.waterTempPin >= 0) {
    p.record.water_temperature = getWaterTemp();
  } else {
    p.record.water_temperature = 0.0;  
  }
  return p;
}
