#include "Arduino.h"
#include "display.h"
#include "comm.h"
#include "network.h"
#include <cstdio>
#include <cstdlib>
#include <cstring>

enum class NodeType
{
  TRANSMITTER,
  RECEIVER,
  SERVER
};

const NodeType node = NodeType::SERVER;

void setup()
{
  Heltec.begin();
  comm::initializeComm();
  display::initializeOLED();

  // node specific initializations
  if (node == NodeType::SERVER)
  {
    network::initializeWireless();
    network::initializeFirebase();
  }
}

void loop()
{
  
}