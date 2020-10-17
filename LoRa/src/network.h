#ifndef NETWORK_H_
#define NETWORK_H_

#include <WiFi.h>
#include <FirebaseESP32.h>

namespace network
{
    extern const char *ssid;
    extern const char *password;

    extern const String firebaseDBURL;
    extern const String firebaseDBSecret;

    extern const String firebaseRoot;

    extern FirebaseData firebaseData;

    extern void scanNetworks();
    extern void initializeWireless();
    extern void initializeFirebase();
    extern void storeFirebaseData();

} // namespace wireless

#endif