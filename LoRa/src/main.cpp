#include "Arduino.h"
#include "display.h"
#include "comm.h"
#include "network.h"
#include <cstdio>
#include <cstdlib>
#include <cstring>

String data;
String response = "0";

/**
 * initializes all systems for board
 */
void initialize()
{
  Heltec.begin();
  comm::initializeComm();
  display::initializeOLED();
}

void setup()
{
  // initialize Serial Monitor
  initialize();
  Serial.begin(115200);
  display::clear();
}

void sendFirst()
{
  // wait until data is found, keep sending new data until found
  String response = "0";
  while (true)
  {
    data = "";
    while (data.length() == 0)
    {
      display::clear();
      display::write("Sending new data!");
      comm::sendData(response);
      display::write(1, "sent new data!");

      display::clear();
      display::write("Listening for data...");
      data = comm::listen(SYNC_DEF, 30);
    }

    // found new data, increment and send new repsonse
    display::write(1, "Got Data: ");
    display::write(2, data);

    int num = std::atoi(data.c_str());
    char responseRaw[4];
    sprintf(responseRaw, "%d", num + 1);
    String tmp(responseRaw);
    response = tmp;

    delay(2000);
  }
}

void listenFirst()
{
  // wait until data is found, keep sending new data until found
  String response = "0";
  while (true)
  {

    display::clear();
    display::write("Listening for data...");
    data = comm::listen(SYNC_DEF);

    // found new data, increment and send new repsonse
    display::write(1, "Got Data: ");
    display::write(2, data);

    delay(2000);

    int num = std::atoi(data.c_str());
    char responseRaw[4];
    sprintf(responseRaw, "%d", num + 1);
    String tmp(responseRaw);
    response = tmp;
    data = "";

    while (data.length() == 0)
    {
      display::clear();
      display::write("Sending new data!");
      comm::sendData(response);
      display::write(1, "sent new data!");

      display::clear();
      display::write("Listening for data...");
      data = comm::listen(SYNC_DEF, 10);
    }
  }
}

void wifiNode()
{
  //network::scanNetworks();
  network::initializeWireless();
  network::serve();
}
void loop()
{
  wifiNode();
}