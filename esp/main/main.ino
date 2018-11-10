#include <ESP8266WiFi.h>
#include "context.h"
#include "credentials.h"
#include "service.h"
#include "led.h"
#include "ota.h"
#include "pins.h"
#include "report_gen.h"

const unsigned long WIFI_CONNECTION_TIMEOUT = 30 * 1000; // 30 seconds
const unsigned long REBOOT_INTERVAL_MS = 1000 * 60 * 60 * 24; // reboot every 24 hours
const unsigned long CONFIG_RETRIEVAL_FREQUENCY = 1; // every 1 minute

unsigned long reportSendingLastTime = 0;
unsigned long pumpEnableLastTime = 0;
unsigned long configRetrievalLastTime = 0;

void setup() {
  Serial.begin(115200);
  delay(10);
  pinMode(BUILTIN_LED_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);

  if (!spiffs_init()) {
    go_to_limbo("SPIFFS init failed");
  }

  connectWiFi();

  CFG = get_config();

  Serial.println(CFG.__runPumpOnce);
  if (CFG.__runPumpOnce) {
    switchPump(true);
    go_to_limbo("Running pump once");
  }

  ota_init();

  report_gen_init();

  switchPump(false);
  switchLed(false);

  service_bootup();
  SEND_REPORT();
  PUMP_ENABLE();
}

void loop() {
  ota_handle();

  if ((millis() - configRetrievalLastTime) > (CONFIG_RETRIEVAL_FREQUENCY * 60000)) {
    configRetrievalLastTime = millis();
    CFG = get_config();
  }
  if ((millis() - reportSendingLastTime) > (CFG.reportSendingFrequency * 60000)) {
    SEND_REPORT();
  }
  if (((millis() - pumpEnableLastTime) > (CFG.pumpEnableFrequency * 1000) && !pumpEnabled)) {
    PUMP_ENABLE();
  }
  if (((millis() - pumpEnableLastTime) > (CFG.pumpDuration * 1000) && pumpEnabled)) {
    PUMP_DISABLE();
  }
  if ((millis() > REBOOT_INTERVAL_MS) && !pumpEnabled) {
    ESP.restart();
  }
  if (CFG.__runPumpOnce) {
    PUMP_ENABLE();
    go_to_limbo("Running pump once");
  }
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

