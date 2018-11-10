#include <Arduino.h>

#ifndef H_STRUCT
#define H_STRUCT

typedef union PumpPackage {
  byte data[5];
  struct __attribute((__packed__)) {
    long datetime;
    boolean enabled;
  } record;  
};

typedef union SensorPackage {
  byte data[16];
  struct __attribute((__packed__)) {
    long datetime;
    float temperature;
    float humidity;
    float water_temperature;
  } record;  
};

typedef union BootupPackage {
  byte data[4];
  struct __attribute((__packed__)) {
    long datetime;
  } record;
};

const int CONFIG_VERSION = 1;

typedef struct Config {
  unsigned int pumpEnableFrequency;
  unsigned int pumpDuration;
  unsigned int reportSendingFrequency;
  String hash;
  boolean __runPumpOnce;
};

#endif
