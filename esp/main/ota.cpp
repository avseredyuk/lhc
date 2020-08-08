#include <ArduinoOTA.h>
#include "context.h"

WiFiServer TelnetServer(8266);

void ota_init() {
  TelnetServer.begin();
  
  ArduinoOTA.setPort(credentials.otaPort);
  ArduinoOTA.setHostname(credentials.otaHostname.c_str());
  ArduinoOTA.setPassword(credentials.otaPassword.c_str());
  ArduinoOTA.onStart([]() {
    Serial.println("OTA Start");
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("OTA End");
    Serial.println("Rebooting...");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r\n", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();
}

void ota_handle() {
  ArduinoOTA.handle();
}

