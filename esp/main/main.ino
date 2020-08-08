#include <ESP8266WiFi.h>
#include "context.h"
#include "service.h"
#include "ota.h"
#include "report_gen.h"
#include "utils.h"

const unsigned long WIFI_CONNECTION_TIMEOUT = 30 * 1000; // 30 seconds
const unsigned long REBOOT_INTERVAL_MS = 1000 * 60 * 60 * 24; // reboot every 24 hours
const unsigned long CONFIG_RETRIEVAL_FREQUENCY = 1; // every 1 minute

unsigned long reportSendingLastTime = 0;
unsigned long pumpEnableLastTime = 0;
unsigned long configRetrievalLastTime = 0;

void setup() {
  Serial.begin(115200);

  pinMode(BUILTIN_LED_PIN, OUTPUT);

  if (!spiffs_init()) {
    go_to_limbo("   ! SPIFFS init failed");
  }

  if (!getCredentials(credentials)) {
    go_to_limbo("   ! No credentials found");
  }

  connectWiFi();

  CFG = get_config();

  if (isPumpConfigValid()) {
    Serial.println("   * Pump config valid, relay Pin: <" + String(CFG.relayPin) + ">");
    pinMode(CFG.relayPin, OUTPUT);
  } else {
    Serial.println("   * Pump config not valid");
  }

  Serial.println("   * Run pump once: <" + String(CFG.__runPumpOnce) + ">");
  if (CFG.__runPumpOnce == true && isPumpConfigValid()) {
    switchPump(true);
    go_to_limbo("   * Running pump once");
  }

  ota_init();

  if (isReportSendingConfigValid()) {
    Serial.println("   * Report send config valid, sending frequency: <" + String(CFG.reportSendingFrequency) + ">");
    report_gen_init();
  } else {
    Serial.println("   * Report send config not valid");
  }

  if (isPumpConfigValid()) {
    switchPump(false);
  }

  switchLed(false);

  service_bootup();

  if (isReportSendingConfigValid()) {
    SEND_REPORT();
  }

  if (isPumpConfigValid()) {
    PUMP_ENABLE();
  }
}

void loop() {
  ota_handle();

  if ((millis() - configRetrievalLastTime) > (CONFIG_RETRIEVAL_FREQUENCY * 60000)) {
    configRetrievalLastTime = millis();
    CFG = get_config();
  }
  if (((millis() - reportSendingLastTime) > (CFG.reportSendingFrequency * 60000)) && isReportSendingConfigValid()) {
    SEND_REPORT();
  }
  if (((millis() - pumpEnableLastTime) > (CFG.pumpEnableFrequency * 1000)) && !pumpEnabled && isPumpConfigValid()) {
    PUMP_ENABLE();
  }
  if (((millis() - pumpEnableLastTime) > (CFG.pumpDuration * 1000)) && pumpEnabled && isPumpConfigValid()) {
    PUMP_DISABLE();
  }
  if ((millis() > REBOOT_INTERVAL_MS) && !pumpEnabled) {
    ESP.restart();
  }
  if (CFG.__runPumpOnce && isPumpConfigValid()) {
    switchPump(true);
    go_to_limbo("   * Running pump once");
  }
}

boolean isPumpConfigValid() {
  return CFG.pumpEnableFrequency != -1 && CFG.pumpDuration != -1 && CFG.relayPin != -1;
}

boolean isReportSendingConfigValid() {
  return CFG.reportSendingFrequency != -1;
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

void connectWiFi() {
  Serial.println("   * Connecting to " + String(credentials.wifiSSID));

  WiFi.mode(WIFI_STA);
  WiFi.begin(credentials.wifiSSID.c_str(), credentials.wifiPassword.c_str());

  int connCount = 1;
  long connAttemptStarted = millis();
  while ((WiFi.status() != WL_CONNECTED) &&
         (millis() < (connAttemptStarted + WIFI_CONNECTION_TIMEOUT))) {
    delay(500);
    Serial.println("      * waiting: #" + String(connCount));
    connCount++;
  }

  Serial.println("   * WiFi connected, IP address: " + String(WiFi.localIP()));
}
