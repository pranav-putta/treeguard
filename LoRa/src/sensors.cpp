#include "sensors.h"

using namespace sensors;

const int sensors::dhtSensorPin = 17;
const int sensors::co2SensorPin = 18;
DHTesp sensors::dht;

void sensors::initializeSensors()
{
    dht.setup(dhtSensorPin, DHTesp::DHT11);
    adcAttachPin(co2SensorPin);
    adcAttachPin(moistureSensorPin);
}

TempAndHumidity sensors::getTempAndHumidity()
{
    auto out = dht.getTempAndHumidity();
    delay(250);
    return out;
}

String sensors::getTempAndHumidityAsString()
{
    auto reading = getTempAndHumidity();
    String s = "Temp: ";
    s += reading.temperature;
    s += " C";
    s = "Humidity: ";
    s += reading.humidity;
    s += "%";
    return s;
}

float sensors::getCO2()
{
    adcStart(co2SensorPin);
    auto reading = analogRead(co2SensorPin);
    adcEnd(co2SensorPin);

    // map
    return reading;
}

float sensors::getMoisture() {
    adcStart(moistureSensorPin);
    auto reading = analogRead(moistureSensorPin);
    adcEnd(moistureSensorPin);

    // map
    return reading;
}