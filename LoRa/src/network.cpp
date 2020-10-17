#include "network.h"
#include "display.h"

using namespace network;

const char *network::ssid = "Test";
const char *network::password = "pranavsiphone";

const String network::firebaseDBURL = "treewatch-f6df4.firebaseio.com";
const String network::firebaseDBSecret = "4vtIHebd036PIAN62knvv5O8j1Lkf2oJemf0A4xX";

const String network::firebaseRoot = "/root";

FirebaseData network::firebaseData;
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

void network::initializeFirebase()
{
    Firebase.begin(firebaseDBURL, firebaseDBSecret);
    Firebase.reconnectWiFi(true);
}

void network::storeFirebaseData()
{
    display::clear();
    bool response = Firebase.setBool(firebaseData, firebaseRoot + "/reached", true);
    if (response)
    {
        display::write("yo it worked tho.");
    }
    else
    {
        display::write("yo it didnt work tho.");
    }
    delay(100000);
}