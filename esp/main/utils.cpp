#include <Arduino.h>
#include "context.h"

int BUILTIN_LED_PIN = D0; // 16

void switchPump(boolean enableParam) {
  digitalWrite(CFG.relayPin, enableParam ? LOW : HIGH);
}

void switchLed(boolean enableParam) {
  digitalWrite(BUILTIN_LED_PIN, enableParam ? LOW : HIGH);
}

