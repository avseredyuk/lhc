#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include "context.h"
#include <FS.h>
#include "report_gen.h"
#include "sender.h"
#include "to_string.h"
#include "utils.h"
#include <ESP8266WiFi.h>

const char* file_name = "/config.txt";
const char* credentials_file_name = "/credentials.txt";

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
  Serial.println("   * Comparing stored & remote configs...");
  Serial.print("      * stored: <" + cfgStored.hash + ">, length: <" + cfgStored.hash.length() + ">, content: <");
  for (int i = 0; i < cfgStored.hash.length(); i++){
    if (i > 0){
      Serial.print(" "); 
    }
    Serial.print(cfgStored.hash[i], DEC);
  }
  Serial.println(">");

  Serial.print("      * remote: <" + cfgRemote.hash + " >, length: <" + cfgRemote.hash.length() + ">, content: <");
  for (int i = 0; i < cfgRemote.hash.length(); i++){
    if (i > 0){
      Serial.print(" "); 
    }
    Serial.print(cfgRemote.hash[i], DEC);
  }
  Serial.println(">");

  Serial.println("      * result is: <" + String(cfgStored.hash.equals(cfgRemote.hash)) + ">");
  return cfgStored.hash.equals(cfgRemote.hash);
}

boolean spiffs_init() {  
  return SPIFFS.begin(); 
}

boolean store_config(Config cfg) {
  File f = SPIFFS.open(file_name, "w");  
  if (!f) { 
    Serial.println("   ! File open failed"); 
    return false;
  } else {  
    Serial.println("   * Storing config"); 
    //todo: problem - repeatable read from spiffs, need to cache cfg in memory
    Serial.println("      * config version: " + String(CONFIG_VERSION));
    f.println(CONFIG_VERSION);
    Serial.println("      * pumpEnableFrequency: " + String(cfg.pumpEnableFrequency));
    f.println(cfg.pumpEnableFrequency);
    Serial.println("      * pumpDuration: " + String(cfg.pumpDuration));
    f.println(cfg.pumpDuration);
    Serial.println("      * reportSendingFrequency: " + String(cfg.reportSendingFrequency));
    f.println(cfg.reportSendingFrequency);
    Serial.println("      * hash: " + String(cfg.hash));
    f.println(cfg.hash);
    Serial.println("      * relayPin: " + String(cfg.relayPin));
    f.println(cfg.relayPin);
    Serial.println("      * waterTempPin: " + String(cfg.waterTempPin));
    f.println(cfg.waterTempPin);
    Serial.println("      * airTempHumidityPin: " + String(cfg.airTempHumidityPin));
    f.println(cfg.airTempHumidityPin);
    f.close();  
    return true;
  }
}

boolean readStoredConfig(Config &cfg) {
  File f = SPIFFS.open(file_name, "r");
  if (!f) {
    Serial.println("   ! Can't open config for reading");
    return false;
  } else {
    Serial.println("   * Reading stored config");
    if (f.available()) {
      String line = f.readStringUntil('\n');
      Serial.println("      * config version: " + line);
      int cfgVer = line.toInt();
      if (cfgVer != CONFIG_VERSION) {
        return false;
      }
      
      line = f.readStringUntil('\n');
      Serial.println("      * pumpEnableFrequency: " + line);
      cfg.pumpEnableFrequency = line.toInt();
      
      line = f.readStringUntil('\n');
      Serial.println("      * pumpDuration: " + line);
      cfg.pumpDuration = line.toInt();
      
      line = f.readStringUntil('\n');
      Serial.println("      * reportSendingFrequency: " + line);
      cfg.reportSendingFrequency = line.toInt();
      
      line = f.readStringUntil('\n');
      line.trim();
      Serial.println("      * hash: " + line);
      cfg.hash = line;

      line = f.readStringUntil('\n');
      Serial.println("      * relayPin: " + line);
      cfg.relayPin = line.toInt();

      line = f.readStringUntil('\n');
      Serial.println("      * waterTempPin: " + line);
      cfg.waterTempPin = line.toInt();

      line = f.readStringUntil('\n');
      Serial.println("      * airTempHumidityPin: " + line);
      cfg.airTempHumidityPin = line.toInt();
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
  
  HTTPClient http;
  String url = concatLogToUri(String("http://") + credentials.lhcHost + String("/cfg"));
  http.begin(url);
  http.addHeader("AuthToken", credentials.lhcToken);
  int httpCode = http.GET();
  Serial.println("   * Reading remote config");
  Serial.println("      * URL: " + url);
  Serial.println("      * response code: " + String(httpCode));
                                                        
  if (httpCode == 200) {
    const size_t capacity = JSON_OBJECT_SIZE(8) + 230;
    DynamicJsonDocument root(capacity);

    String httpResponse = http.getString();
    Serial.println("      * response: ");
    Serial.println("         > " + httpResponse);
    
    deserializeJson(root, httpResponse);

    Serial.println("      * parsed values: ");

    const char* PUMP_DURATION = root["PUMP_DURATION"]; // "180"
    if (PUMP_DURATION != NULL) {
      cfg.pumpDuration = String(PUMP_DURATION).toInt();
      Serial.println("         * pumpDuration: " + String(PUMP_DURATION));
    } else {
      Serial.println("         * pumpDuration: NULL");
    }
    
    const char* REPORT_SEND_FREQUENCY = root["REPORT_SEND_FREQUENCY"]; // "5"
    if (REPORT_SEND_FREQUENCY != NULL) {
      cfg.reportSendingFrequency = String(REPORT_SEND_FREQUENCY).toInt();
      Serial.println("         * reportSendingFreq: " + String(REPORT_SEND_FREQUENCY));
    } else {
      Serial.println("         * reportSendingFreq: NULL");
    }
    
    const char* RUN_PUMP_ONCE = root["RUN_PUMP_ONCE"]; // "FALSE"
    if (RUN_PUMP_ONCE != NULL) {
      cfg.__runPumpOnce = toBoolean(String(RUN_PUMP_ONCE));
      Serial.println("         * runPumpOnce: " + String(RUN_PUMP_ONCE));
    } else {
      Serial.println("         * runPumpOnce: NULL");
    }
    
    const char* PUMP_ENABLE_FREQUENCY = root["PUMP_ENABLE_FREQUENCY"]; // "7200"
    if (PUMP_ENABLE_FREQUENCY != NULL) {
      cfg.pumpEnableFrequency = String(PUMP_ENABLE_FREQUENCY).toInt();
      Serial.println("         * pumpEnableFrequency: " + String(PUMP_ENABLE_FREQUENCY));
    } else {
      Serial.println("         * pumpEnableFrequency: NULL");
    }

    const char* RELAY_PIN = root["RELAY_PIN"]; // "20"
    if (RELAY_PIN != NULL) {
      cfg.relayPin = String(RELAY_PIN).toInt();
      Serial.println("         * relayPin: " + String(RELAY_PIN));
    } else {
      Serial.println("         * relayPin: NULL");
    }

    const char* WATER_TEMP_PIN = root["WATER_TEMP_PIN"]; // "20"
    if (WATER_TEMP_PIN != NULL) {
      cfg.waterTempPin = String(WATER_TEMP_PIN).toInt();
      Serial.println("         * waterTempPin: " + String(WATER_TEMP_PIN));
    } else {
      Serial.println("         * waterTempPin: NULL");
    }

    const char* AIR_TEMP_HUM_PIN = root["AIR_TEMP_HUM_PIN"]; // "20"
    if (AIR_TEMP_HUM_PIN != NULL) {
      cfg.airTempHumidityPin = String(AIR_TEMP_HUM_PIN).toInt();
      Serial.println("         * airTempHumidityPin: " + String(AIR_TEMP_HUM_PIN));
    } else {
      Serial.println("         * airTempHumidityPin: NULL");
    }
    
    const char* CONFIG_HASH = root["CONFIG_HASH"]; // "eab72e20d97d8fdae2ca621e38d455c1f65b1689"
    if (CONFIG_HASH != NULL) {
      cfg.hash = CONFIG_HASH;
      Serial.println("         * hash: " + String(CONFIG_HASH)); 
    } else {
      Serial.println("         * hash: NULL"); 
    }

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
        Serial.println("      * replace stored & use remote");
        if (!store_config(cfgRemote)) {
          go_to_limbo("   ! Config update failed");
        }
        return cfgRemote;
      } else {
        // use remote config as it can have pumpRunOnce enabled
        Serial.println("      * returning remote config, but remote & stored are equal");
        return cfgRemote;
      }
    } else {
      //first run, store & use remote one
      Serial.println("      * first run, store & use remote one");
      if (!store_config(cfgRemote)) {
        go_to_limbo("   ! Initial config storage failed");
      }
      return cfgRemote;
    }
  } else if (isStored) {
    //no connection/wifi, go with the stored one
    return cfgStored;
  } else {
    //no config :/
    go_to_limbo("   ! No config");
  }
  // dummy return
  return cfgRemote;
}

boolean getCredentials(Credentials &credentials) {
  File f = SPIFFS.open(credentials_file_name, "r");
  if (!f) {
    Serial.println("   ! Can't open credentials for reading");
    return false;
  } else {
    Serial.println("   * Reading credentials...");
    
    String line = f.readStringUntil('\n');
    Serial.println("      * " + line);
    credentials.wifiSSID = line;

    line = f.readStringUntil('\n');
    Serial.println("      * " + line);
    credentials.wifiPassword = line;

    line = f.readStringUntil('\n');
    Serial.println("      * " + line);
    credentials.lhcHost = line;

    line = f.readStringUntil('\n');
    Serial.println("      * " + line);
    credentials.lhcToken = line;

    line = f.readStringUntil('\n');
    Serial.println("      * " + line);
    credentials.otaPort = line.toInt();

    line = f.readStringUntil('\n');
    Serial.println("      * " + line);
    credentials.otaHostname = line;

    line = f.readStringUntil('\n');
    Serial.println("      * " + line);
    credentials.otaPassword = line;
    
    f.close();
    return true;
  }
}
