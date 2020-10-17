#ifndef NETWORK_H_
#define NETWORK_H_

#include <WiFi.h>
#include <HTTPClient.h>


namespace network
{
    struct data
    {
        float temp;
        float humidity;
        float co2_ppi;

        int collector_id;
        int sender_id;

        int status;
    };

    extern const char *ssid;
    extern const char *password;

    extern const char *firebaseUploadFunctionURL;

    extern const String firebaseRoot;


    extern void scanNetworks();
    extern void initializeWireless();
    extern void storeFirebaseData(network::data data);

} // namespace network

#endif