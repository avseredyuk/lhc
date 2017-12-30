#include "context.h"
#include "ntp.h"
#include "report_gen.h"
#include "sender.h"
#include "spiffser.h"
#include "to_string.h"

void service_bootup() {
  BootupPackage p = getBootupReport();
  if (!sendToHost("/bootup/add", to_string_bootup(p))) {
    write_data(p.data, sizeof(p.data));
    hasSavedData = true;
  }
}

void service_pump() {
  PumpPackage p = getPumpReport();
  if (!sendToHost("/pump/add", to_string_pump(p))) {
    write_data(p.data, sizeof(p.data));
    hasSavedData = true;
  }
}

void service_sensor() {
  SensorPackage p = getSensorsReport();
  if (!sendToHost("/report/add", to_string_sensor(p))) {
    write_data(p.data, sizeof(p.data));
    hasSavedData = true;
  }
}

void service_ntp() {
  if (timeSync.record.datetime == 0) {
    long ntp_remote = ntp_timestamp();
    if (ntp_remote != 0) {
      timeSync.record.datetime = millis();
      timeSync.record.remote_datetime = ntp_remote;
      write_data(timeSync.data, sizeof(timeSync.data));
    }
  }
}

