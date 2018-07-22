#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WString.h>
#include "context.h"
#include "credentials.h"
#include "led.h"

const int CONNECTION_TIMEOUT = 5000;

String getToken() {
  String token = String(WiFi.macAddress());
  token.replace(':','0');
  return token;
}

String concatLogToUri(String resourceUri) {
  return resourceUri + "?heap=" + String(ESP.getFreeHeap()) + "&millis=" + millis();
}

boolean sendToHost(String resourceUri, String content) {
  String uriWithLogs = concatLogToUri(resourceUri);

  switchLed(true);
  
  Serial.println("connecting to " + String(LHC_HOST));

  WiFiClient client;
  if (!client.connect(LHC_HOST, 80)) {
    
    Serial.println("connection failed");
    
    switchLed(false);
    return false;
  }

  Serial.println("Requesting URL: " + String(uriWithLogs));

  client.println("POST " + uriWithLogs + " HTTP/1.1");
  client.println("Host: " + String(LHC_HOST));
  client.println("Content-Length: " + String(content.length()));
  client.println("Content-Type: application/json");
  client.println("AuthToken: " + getToken());
  client.println();
  client.println(content);

  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > CONNECTION_TIMEOUT) {
      
      Serial.println(">>> Client Timeout !");
        
      client.stop();
      switchLed(false);
      return false;
    }
  }

  while (client.available()) {
    String line = client.readStringUntil('\r');
    
    Serial.print(line);
  }

  Serial.println("closing connection");
    
  switchLed(false);

  return true;
}
