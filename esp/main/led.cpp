#include <Arduino.h>
#include "pins.h"

void switchLed(boolean enableParam) {
  digitalWrite(BUILTIN_LED_PIN, enableParam ? LOW : HIGH);
}
