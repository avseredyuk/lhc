#include <ESP8266WiFi.h>
#include <DHT.h>
#include <DallasTemperature.h>
#include "credentials.h"

long reportSendingLastTime = 0;
long reportSendingFrequency = 5; // every X minutes per hour
long pumpEnableLastTime = 0;
long pumpEnableFrequency = 60 * 60;   // seconds, every 1 hour
long pumpRunningTime = 180;          // seconds   3:00
boolean pumpEnabled = false;
// reconnect when connection fails
long lastReconnectTime = 0;
const int RECONNECT_MINIMUM_INTERVAL = 1000 * 60 * 60; // diff between reconnects is 1 hour

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
}

void loop() {
  if ((millis() - reportSendingLastTime) > (reportSendingFrequency * 60000)) {
    reportSendingLastTime = millis();
    sendToHost("/report/add", getSensorsReport());
  }
  if (((millis() - pumpEnableLastTime) > (pumpEnableFrequency * 1000) && !pumpEnabled)) {
    pumpEnableLastTime = millis();
    pumpEnabled = true;
    switchPump(pumpEnabled);
    sendToHost("/pump/add", getPumpReport(pumpEnabled));
  }
  if (((millis() - pumpEnableLastTime) > (pumpRunningTime * 1000) && pumpEnabled)) {
    pumpEnabled = false;
    switchPump(pumpEnabled);
    sendToHost("/pump/add", getPumpReport(pumpEnabled));
  }
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

      if ((millis() - lastReconnectTime) > RECONNECT_MINIMUM_INTERVAL) {
        Serial.println(">>> Trying to reconnect");
        lastReconnectTime = millis();
        connectWiFi();
      }
      
      return;
    }
  }
  
  while(client.available()){
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
  float temp;
  do {
    DS18B20.requestTemperatures(); 
    temp = DS18B20.getTempCByIndex(0);
  } while (temp == 85.0 || temp == (-127.0));
  return temp;
}

void connectWiFi() {
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

