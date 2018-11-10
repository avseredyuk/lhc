#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include "context.h"
#include "credentials.h"
#include <FS.h>
#include "led.h"
#include "report_gen.h"
#include "sender.h"
#include "to_string.h"
#include <ESP8266WiFi.h>

const char* file_name = "/config.txt";

void service_bootup() {
  BootupPackage p = getBootupReport();
  sendToHost("/bootup/add", to_string_bootup(p));
}

void service_pump() {
  PumpPackage p = getPumpReport();
  sendToHost("/pump/add", to_string_pump(p));
}

void service_sensor() {
  SensorPackage p = getSensorsReport();
  sendToHost("/report/add", to_string_sensor(p));
}

boolean areConfigsSame(Config cfgStored, Config cfgRemote) {
  Serial.print(cfgStored.hash + " length=" + cfgStored.hash.length());
  Serial.print(" (");
  for (int i = 0; i < cfgStored.hash.length(); i++){
    if (i > 0){
      Serial.print(" "); 
    }
    Serial.print(cfgStored.hash[i],DEC);
  }
  Serial.println(")");

  Serial.print(cfgRemote.hash+" length="+cfgRemote.hash.length());
  Serial.print(" (");
  for (int i = 0; i < cfgRemote.hash.length(); i++){
    if (i > 0){
      Serial.print(" "); 
    }
    Serial.print(cfgRemote.hash[i],DEC);
  }
  Serial.println(")");

  
  return cfgStored.hash.equals(cfgRemote.hash);
}

boolean spiffs_init() {  
  return SPIFFS.begin(); 
}

boolean store_config(Config cfg) {
  File f = SPIFFS.open(file_name, "w");  
  if (!f) { 
    Serial.println("File open failed"); 
    return false;
  } else {  
    Serial.println("Storing config"); 
    //todo: problem - repeatable read from spiffs, need to cache cfg in memory
    Serial.println(CONFIG_VERSION);
    f.println(CONFIG_VERSION);
    Serial.println(cfg.pumpEnableFrequency);
    f.println(cfg.pumpEnableFrequency);
    Serial.println(cfg.pumpDuration);
    f.println(cfg.pumpDuration);
    Serial.println(cfg.reportSendingFrequency);
    f.println(cfg.reportSendingFrequency);
    Serial.println(cfg.hash);
    f.println(cfg.hash);
    f.close();  
    return true;
  }
}

boolean readStoredConfig(Config &cfg) {
  File f = SPIFFS.open(file_name, "r");
  if (!f) {
    Serial.println("Can't open config fo reading");
    return false;
  } else {
    Serial.println("Reading stored config");
    if (f.available()) {
      String line = f.readStringUntil('\n');
      Serial.println(line);
      int cfgVer = line.toInt();
      if (cfgVer != CONFIG_VERSION) {
        return false;
      }
      if (f.available()) {
        line = f.readStringUntil('\n');
        Serial.println(line);
        cfg.pumpEnableFrequency = line.toInt();
        if (f.available()) {
          line = f.readStringUntil('\n');
          Serial.println(line);
          cfg.pumpDuration = line.toInt();
          if (f.available()) {
            line = f.readStringUntil('\n');
            Serial.println(line);
            cfg.reportSendingFrequency = line.toInt();
            if (f.available()) {
              line = f.readStringUntil('\n');
              line.trim();
              Serial.println(line);
              cfg.hash = line;
            }  
          }  
        }
      }
    }
    f.close();
    cfg.__runPumpOnce = false;
    return true;
  }
}

boolean toBoolean(String str) {
  return str.equals("TRUE");
}

boolean readRemoteConfig(Config &cfg) {
  switchLed(true);
  
  HTTPClient http;  //Object of class HTTPClient
  http.begin(String("http://") + LHC_HOST + String("/cfg"));
  http.addHeader("AuthToken", AUTH_TOKEN);
  int httpCode = http.GET();
  Serial.println("CODE = " + String(httpCode));
  //Check the returning code                                                                  
  if (httpCode == 200) {
    const size_t bufferSize = JSON_OBJECT_SIZE(5) + 160;
    DynamicJsonBuffer jsonBuffer(bufferSize);
    JsonObject& root = jsonBuffer.parseObject(http.getString());

    const char* PUMP_DURATION = root["PUMP_DURATION"]; // "180"
    const char* CONFIG_HASH = root["CONFIG_HASH"]; // "eab72e20d97d8fdae2ca621e38d455c1f65b1689"
    const char* REPORT_SEND_FREQUENCY = root["REPORT_SEND_FREQUENCY"]; // "5"
    const char* RUN_PUMP_ONCE = root["RUN_PUMP_ONCE"]; // "FALSE"
    const char* PUMP_ENABLE_FREQUENCY = root["PUMP_ENABLE_FREQUENCY"]; // "7200"
    
    cfg.pumpDuration = String(PUMP_DURATION).toInt();
    Serial.println(cfg.pumpDuration);
    cfg.hash = CONFIG_HASH;
    Serial.println(cfg.hash);
    cfg.reportSendingFrequency = String(REPORT_SEND_FREQUENCY).toInt();
    Serial.println(cfg.reportSendingFrequency);
    cfg.__runPumpOnce = toBoolean(String(RUN_PUMP_ONCE));
    Serial.println(cfg.__runPumpOnce);
    cfg.pumpEnableFrequency = String(PUMP_ENABLE_FREQUENCY).toInt();
    Serial.println(cfg.pumpEnableFrequency);
    
    http.end();
    switchLed(false);
    return true;
  } else {
    http.end();
    switchLed(false);
    return false;
  }
}

void go_to_limbo(String message) {
  boolean ledActive = true;
  while (true) {
    Serial.println(message);
    switchLed(ledActive);
    ledActive = !ledActive;
    delay(250);
  }
}

Config get_config() {
  Config cfgStored;
  boolean isStored = readStoredConfig(cfgStored);
  Config cfgRemote;
  boolean isRemote = readRemoteConfig(cfgRemote);

  if (isRemote) {
    if (isStored) {
      //compare configs & select remote if they differs
      if (!areConfigsSame(cfgStored, cfgRemote)) {
        // replace stored & use remote
        Serial.println("replace stored & use remote");
        if (!store_config(cfgRemote)) {
          go_to_limbo("Config update failed");
        }
        return cfgRemote;
      } else {
        // use remote config as it can have pumpRunOnce enabled
        return cfgRemote;
      }
    } else {
      //first run, store & use remote one
      Serial.println("first run, store & use remote one");
      if (!store_config(cfgRemote)) {
        go_to_limbo("Initial config storage failed");
      }
      return cfgRemote;
    }
  } else if (isStored) {
    //no connection/wifi, go with the stored one
    return cfgStored;
  } else {
    //no config :/
    go_to_limbo("No config");
  }
  // dummy return
  return cfgRemote;
}

