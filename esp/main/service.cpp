#include "context.h"
#include "report_gen.h"
#include "sender.h"
#include "to_string.h"

void service_bootup() {
  BootupPackage p = getBootupReport();
  sendToHost("/bootup/add", to_string_bootup(p));
}

void service_pump() {
  PumpPackage p = getPumpReport();
  sendToHost("/pump/add", to_string_pump(p));
}

void service_sensor() {
  SensorPackage p = getSensorsReport();
  sendToHost("/report/add", to_string_sensor(p));
}

