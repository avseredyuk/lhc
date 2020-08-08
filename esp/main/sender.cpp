#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WString.h>
#include "context.h"
#include "utils.h"

const int CONNECTION_TIMEOUT = 5000;

String concatLogToUri(String resourceUri) {
  return resourceUri + "?heap=" + String(ESP.getFreeHeap()) + "&millis=" + millis();
}

boolean sendToHost(String resourceUri, String content) {
  String uriWithLogs = concatLogToUri(resourceUri);

  switchLed(true);
  
  Serial.println("   * Connecting to <" + credentials.lhcHost + ">");

  WiFiClient client;
  if (!client.connect(credentials.lhcHost.c_str(), 80)) {
    
    Serial.println("   ! Connection failed");
    
    switchLed(false);
    return false;
  }

  Serial.println("      * Requesting URL: " + String(uriWithLogs));

  Serial.println("      * Request: ");
  Serial.println("         > " + content);

  client.println("POST " + uriWithLogs + " HTTP/1.1");
  client.println("Host: " + String(credentials.lhcHost));
  client.println("Content-Length: " + String(content.length()));
  client.println("Content-Type: application/json");
  client.println("AuthToken: " + String(credentials.lhcToken));
  client.println();
  client.println(content);

  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > CONNECTION_TIMEOUT) {
      
      Serial.println("      ! Client Timeout !");
        
      client.stop();
      switchLed(false);
      return false;
    }
  }

  Serial.println("      * Response: ");
  while (client.available()) {
    String line = client.readStringUntil('\r');
    line.trim();
    Serial.println("         > " + line);
  }

  switchLed(false);

  return true;
}
