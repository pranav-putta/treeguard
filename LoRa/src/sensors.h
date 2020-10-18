#ifndef SENSORS_H_
#define SENSORS_H_

#include "DHTesp.h"

namespace sensors
{

    extern const int dhtSensorPin;
    extern const int co2SensorPin;
    extern const int moistureSensorPin;
    extern DHTesp dht;

    extern void initializeSensors();
    extern TempAndHumidity getTempAndHumidity();
    extern String getTempAndHumidityAsString();
    extern float getCO2();
    extern float getMoisture();
} // namespace sensors
#endif