#ifndef NETWORK_H_
#define NETWORK_H_

#include <WiFi.h>

namespace network
{
    extern const char *ssid;
    extern const char *password;

    extern WiFiServer server;
    // Auxiliar variables to store the current output state
    extern String output25State;
    extern String output26State;
    extern String output27State;

    // Assign output variables to GPIO pins
    extern const int output25;
    extern const int output26;
    extern const int output27;

    extern unsigned long currentTime;
    extern unsigned long previousTime;
    extern const long timeoutTime;

    extern void scanNetworks();
    extern void initializeWireless();
    extern void serve();

} // namespace wireless

#endif