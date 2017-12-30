#include "struct.h"
#include <FS.h>

#ifndef H_SPIFFSER
#define H_SPIFFSER

const char* file_name = "/b_data.bin";

void write_data(byte data[], int data_size) {
  File f = SPIFFS.open(file_name, "a+");
  if (!f) {
    Serial.println("file open failed");
  } else {
    Serial.println("SIZE S: " + String(f.size()));
    f.write(data, data_size);

    for (int i = 0; i < data_size; i++) {
      Serial.println(data[i], HEX);
    }
    
    Serial.println("SIZE E: " + String(f.size()));
    f.close();
  }
}

long saved_data_size() {
  File f = SPIFFS.open("/b_data.bin", "r");
  if (!f) {
    return -1;
  } else {
    long fs = f.size();
    f.close();
    return fs;
  }
}

boolean has_saved_data() {
  return saved_data_size() > 0;
}

void spiffs_init() {
  SPIFFS.begin();
  write_data( new byte[1] { (byte) 0xFF }, 1);
}

#endif
