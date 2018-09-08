#include <ESP8266WiFi.h>
#include "context.h"
#include "credentials.h"
#include "service.h"
#include "led.h"
#include "ota.h"
#include "pins.h"
#include "report_gen.h"

const long WIFI_CONNECTION_TIMEOUT = 30 * 1000; // 30 seconds

unsigned long REBOOT_INTERVAL_MS = 1000 * 60 * 60 * 24; // reboot every 24 hours
unsigned long reportSendingLastTime = 0;
unsigned long reportSendingFrequency = 5; // every X minutes per hour
unsigned long pumpEnableLastTime = 0;

#if defined(LHC_BIG)
  unsigned long pumpEnableFrequency = 60 * 60 * 2;   // seconds, every 2 hours
  unsigned long pumpRunningTime = 180;          // seconds   03:00
#else
  unsigned long pumpEnableFrequency = 60 * 60 * 2;   // seconds, every 2 hours
  unsigned long pumpRunningTime = 45;          // seconds   00:45
#endif

void setup() {
  Serial.begin(115200);
  delay(10);

  connectWiFi();

  ota_config();

  report_gen_init();
  
  pinMode(BUILTIN_LED_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT); 
  switchPump(false);
  switchLed(false);

  SEND_BOOTUP();
  SEND_REPORT();
  PUMP_ENABLE();
}

void loop() {
  ota_handle();
  
  if ((millis() - reportSendingLastTime) > (reportSendingFrequency * 60000)) {
    SEND_REPORT();
  }
  if (((millis() - pumpEnableLastTime) > (pumpEnableFrequency * 1000) && !pumpEnabled)) {
    PUMP_ENABLE();
  }
  if (((millis() - pumpEnableLastTime) > (pumpRunningTime * 1000) && pumpEnabled)) {
    PUMP_DISABLE();
  }
  if ((millis() > REBOOT_INTERVAL_MS) && !pumpEnabled) {
    ESP.restart();
  }
}

void SEND_BOOTUP() {
  service_bootup();
}

void SEND_REPORT() {
  reportSendingLastTime = millis();
  service_sensor();
}

void PUMP_ENABLE() {
  pumpEnableLastTime = millis();
  pumpEnabled = true;
  switchPump(pumpEnabled);
  service_pump();
}

void PUMP_DISABLE() {
  pumpEnabled = false;
  switchPump(pumpEnabled);
  service_pump();
}

void switchPump(boolean enableParam) {
  digitalWrite(RELAY_PIN, enableParam ? LOW : HIGH);
}

void connectWiFi() {
  Serial.println("Connecting to " + String(WIFI_SSID));
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int connCount = 1;
  long connAttemptStarted = millis();
  while ((WiFi.status() != WL_CONNECTED) && 
         (millis() < (connAttemptStarted + WIFI_CONNECTION_TIMEOUT))) {
    delay(500);
    Serial.println("  -> waiting: #" + String(connCount));
    connCount++;
  }

  Serial.println("WiFi connected");
  Serial.println("IP address: " + String(WiFi.localIP()));
}

