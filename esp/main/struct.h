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

const int CONFIG_VERSION = 2;

typedef struct Config {
  signed int pumpEnableFrequency = -1;
  signed int pumpDuration = -1;
  signed int reportSendingFrequency = -1;
  signed int relayPin = -1;
  signed int waterTempPin = -1;
  signed int airTempHumidityPin = -1;
  String hash = "";
  boolean __runPumpOnce = false;
};

typedef struct Credentials {
  String wifiSSID;
  String wifiPassword;
  String lhcHost;
  String lhcToken;
  unsigned int otaPort;
  String otaHostname;
  String otaPassword;
};
#endif
