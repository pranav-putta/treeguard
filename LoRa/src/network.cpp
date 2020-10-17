#include "network.h"
#include "display.h"

using namespace network;

const char *network::ssid = "Test";
const char *network::password = "pranavsiphone";

WiFiServer network::server(80);

String network::output25State = "off";
String network::output26State = "off";
String network::output27State = "off";

const int network::output25 = 0;
const int network::output26 = 0;
const int network::output27 = 0;

unsigned long network::currentTime = millis();
unsigned long network::previousTime = 0;
const long network::timeoutTime = 2000;

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
