#include <ESP8266WiFi.h>
#include <DHT.h>
#include <DallasTemperature.h>
#include "credentials.h"

long REBOOT_INTERVAL_MS = 1000 * 60 * 60 * 24; // reboot every 24 hours
long reportSendingLastTime = 0;
long reportSendingFrequency = 5; // every X minutes per hour
long pumpEnableLastTime = 0;
long pumpEnableFrequency = 60 * 60 * 2;   // seconds, every 2 hours
long pumpRunningTime = 180;          // seconds   3:00
boolean pumpEnabled = false;

const int CONNECTION_TIMEOUT = 5000;
const int ONE_WIRE_BUS = D5;
const int BUILTIN_LED_PIN = D0;
const int RELAY_PIN = D3;
const int DHTPin = D2;

DHT dht(DHTPin, DHT22);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

void setup() {
  Serial.begin(115200);
  delay(10);

  connectWiFi();

  dht.begin();

  pinMode(BUILTIN_LED_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  switchPump(false);
  switchLed(false);

  sendToHost("/bootup/add", "");
  SEND_REPORT();
  PUMP_ENABLE();
}

void loop() {
  if ((millis() - reportSendingLastTime) > (reportSendingFrequency * 60000)) {
    SEND_REPORT();
  }
  if (((millis() - pumpEnableLastTime) > (pumpEnableFrequency * 1000) && !pumpEnabled)) {
    PUMP_ENABLE();
  }
  if (((millis() - pumpEnableLastTime) > (pumpRunningTime * 1000) && pumpEnabled)) {
    PUMP_DISABLE();
  }
}

void SEND_REPORT() {
  reportSendingLastTime = millis();
  sendToHost("/report/add?heap=" + String(ESP.getFreeHeap()), getSensorsReport());
}

void PUMP_ENABLE() {
  // reboot every day stuff
  // done at pre-pump-enable stage to make sure that container is empty and we won't have solution overflow
  // so it'll have discretion of the pump enable frequency
  if (millis() > REBOOT_INTERVAL_MS) {
    ESP.restart();
  }
  pumpEnableLastTime = millis();
  pumpEnabled = true;
  switchPump(pumpEnabled);
  sendToHost("/pump/add", getPumpReport(pumpEnabled));
}

void PUMP_DISABLE() {
  pumpEnabled = false;
  switchPump(pumpEnabled);
  sendToHost("/pump/add", getPumpReport(pumpEnabled));
}

void switchPump(boolean enableParam) {
  digitalWrite(RELAY_PIN, enableParam ? LOW : HIGH);
}

void switchLed(boolean enableParam) {
  digitalWrite(BUILTIN_LED_PIN, enableParam ? LOW : HIGH);
}

void sendToHost(String resourceUri, String content) {
  switchLed(true);
  Serial.println("connecting to " + String(host));

  WiFiClient client;
  const int httpPort = 80;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    switchLed(false);
    return;
  }

  Serial.println("Requesting URL: " + String(resourceUri));

  client.println("POST " + resourceUri + " HTTP/1.1");
  client.println("Host: " + String(host));
  client.println("Content-Length: " + String(content.length()));
  client.println("Content-Type: application/json");
  client.println("AuthToken: " + String(ESP_AUTH_TOKEN));
  client.println();
  client.println(content);

  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > CONNECTION_TIMEOUT) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      switchLed(false);
      return;
    }
  }

  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  Serial.println("closing connection");
  switchLed(false);
}

String getPumpReport(boolean isOn) {
  String result = "{\"a\": \"" + String(isOn ? "ENABLED" : "DISABLED") + "\"}";
  Serial.println(result);
  return result;
}

String getSensorsReport() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float waterTemp = getWaterTemp();
  String result = "{\"t\":" + String(temperature) + ",\"h\":" + String(humidity) + ",\"v\":" + random(30, 100) + ",\"p\":" + random(100, 500) + ",\"w\":" + String(waterTemp) + "}";
  Serial.println(result);
  return result;
}

float getWaterTemp() {
  float temp = 0.0;
  long i = 0;
  do {
    Serial.println("Retry #" + String(i) + ": get water temperature");
    DS18B20.requestTemperatures();
    temp = DS18B20.getTempCByIndex(0);
    i++;
  } while ((temp == 85.0 || temp == (-127.0)) && (i < 10));
  return temp;
}

void connectWiFi() {
  Serial.println("Connecting to " + String(ssid));

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  
  Serial.println("WiFi connected");
  Serial.println("IP address: " + WiFi.localIP());
}

