#include <Arduino.h>

#ifndef H_STRUCT
#define H_STRUCT

typedef union PumpPackage {
  byte data[6];
  struct __attribute((__packed__)) {
    byte type;
    long datetime;
    boolean enabled;
  } record;  
};

typedef union SensorPackage {
  byte data[17];
  struct __attribute((__packed__)) {
    byte type;
    long datetime;
    float temperature;
    float humidity;
    float water_temperature;
  } record;  
};

typedef union BootupPackage {
  byte data[5];
  struct __attribute((__packed__)) {
    byte type;
    long datetime;
  } record;
};

typedef union TimeSyncPackage {
  byte data[9];
  struct __attribute((__packed__)) {
    byte type;
    long datetime;
    long remote_datetime;
  } record;
};

#endif
