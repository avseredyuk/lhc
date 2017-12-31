#include "context.h"
#include "ntp.h"
#include "report_gen.h"
#include "sender.h"
#include "spiffser.h"
#include "to_string.h"

void service_write(byte data[], int data_size) {
  write_data(data, data_size);

  // if this is first spiifs write from bootup && NTP received OK
  // then we should write timeSync to spiffs
  if ((!hasHappenedNetworkFailFromBootup) && (timeSync.record.datetime)) {
      // we should write sync to spiffs when we have network failed first time
      write_data(timeSync.data, sizeof(timeSync.data));
    hasHappenedNetworkFailFromBootup = true;
  }
  
  hasSavedData = true;
}

void service_bootup() {
  BootupPackage p = getBootupReport();
  if (!sendToHost("/bootup/add", to_string_bootup(p))) {
    service_write(p.data, sizeof(p.data));
  }
}

void service_pump() {
  PumpPackage p = getPumpReport();
  if (!sendToHost("/pump/add", to_string_pump(p))) {
    service_write(p.data, sizeof(p.data));
  }
}

void service_sensor() {
  SensorPackage p = getSensorsReport();
  if (!sendToHost("/report/add", to_string_sensor(p))) {
    service_write(p.data, sizeof(p.data));
  }
}

void service_ntp() {
  if (timeSync.record.datetime == 0) {
    long ntp_remote = ntp_timestamp();
    if (ntp_remote != 0) {
      timeSync.record.datetime = millis();
      timeSync.record.remote_datetime = ntp_remote;
    }
  }
}

