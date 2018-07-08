#include <WString.h>
#include "struct.h"

String to_string_bootup(BootupPackage p) {
  return "";
}

String to_string_pump(PumpPackage p) {
  return "{\"a\": \"" + String(p.record.enabled ? "ENABLED" : "DISABLED") + "\"}";
}

String to_string_sensor(SensorPackage p) {
  return "{\"t\":" + String(p.record.temperature) + ",\"h\":" + String(p.record.humidity) + ",\"v\":" + random(30, 100) + ",\"p\":" + random(100, 500) + ",\"w\":" + String(p.record.water_temperature) + "}";
}

