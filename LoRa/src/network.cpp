#include "network.h"
#include "display.h"
#include <ArduinoJson.h>

using namespace network;

const char *network::ssid = "Test";
const char *network::password = "pranavsiphone";

const char *network::firebaseUploadFunctionURL = "https://us-central1-treewatch-f6df4.cloudfunctions.net/sendPacket";

const String network::firebaseRoot = "/root";

/**
 * scans all local networks and prints on screen
 * make sure to initialize display before using this
 */
void network::scanNetworks()
{
    int nCount = WiFi.scanNetworks();
    display::clear();
    if (nCount == 0)
    {
        display::write("No networks found!");
    }
    else
    {
        for (int i = 0; i < nCount; i++)
        {
            display::write(i, WiFi.SSID(i));
        }
    }
}
/**
 * initialize wireless protocol 
 */
void network::initializeWireless()
{
    // connect to wifi network
    display::clear();
    display::write("Connecting to wifi...");
    WiFi.begin(ssid, password);
    int ct = 0;
    while (WiFi.status() != WL_CONNECTED)
    {
        display::write(ct, 1, ".");
        delay(500);
        ct++;
    }
    display::write(2, WiFi.localIP().toString());
}

void network::storeFirebaseData(network::data data)
{
    display::clear();
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(network::firebaseUploadFunctionURL);
        // Specify content-type header
        http.addHeader("Content-Type", "application/json");

        // parse data into json document
        StaticJsonDocument<200> doc;
        doc["temp"] = data.temp;
        doc["humidity"] = data.humidity;
        doc["co2"] = data.co2_ppi;
        doc["sender_id"] = data.sender_id;
        doc["collector_id"] = data.collector_id;
        doc["status"] = data.status;

        String json;
        serializeJson(doc, json);
        int response = http.POST(json);
        if (response > 0)
        {
            display::clear();
            display::write(String(response));
            display::write(1, http.getString().substring(0, 15));
        }
        else
        {
            display::clear();
            display::write("400 error");
        }
        http.end();

        delay(10000);
    }
}
