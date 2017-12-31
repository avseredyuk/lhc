#include <Arduino.h>
#include "struct.h"

boolean pumpEnabled = false;
boolean hasSavedData = false;
boolean hasHappenedNetworkFailFromBootup = false;
TimeSyncPackage timeSync = {4, 0, 0};
