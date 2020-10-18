#include "comm.h"
#include "display.h"

/**
 * 
 */
void comm::initializeComm()
{
    Heltec.LoRa.setPins();
    while (!Heltec.LoRa.begin(915E6, true))
    {
        Serial.print(".");
        delay(500);
    }
}

void comm::sendData(String data, int syncWord, int count)
{
    // set sync word
    Heltec.LoRa.setSyncWord(syncWord);

    // send lora packet
    Heltec.LoRa.beginPacket();
    Heltec.LoRa.setTxPower(14, RF_PACONFIG_PASELECT_PABOOST);
    Heltec.LoRa.print(data);
    if (count != -1)
    {
        Heltec.LoRa.print(count);
    }
    Heltec.LoRa.endPacket();
}

// synchronous method
String comm::listen(int syncWord, int timeout)
{
    // set sync word
    Heltec.LoRa.setSyncWord(syncWord);

    // wait for packet to arrive
    int packetSize = 0, counter = 0;
    while (!packetSize)
    {
        packetSize = Heltec.LoRa.parsePacket();
        if (counter == timeout)
        {
            return "";
        }
        counter++;
        delay(100);
    }

    // read packet buffer into string
    String output;
    while (Heltec.LoRa.available())
    {
        output += Heltec.LoRa.readString();
    }

    return output;
}

/**
 * requests a listen and returns data
 */ 
String comm::asyncListen(int syncWord)
{
    // set sync word
    Heltec.LoRa.setSyncWord(syncWord);

    // wait for packet to arrive
    int packetSize = Heltec.LoRa.parsePacket();

    if (!packetSize)
    {
        return "";
    }
    // read packet buffer into string
    String output;
    while (Heltec.LoRa.available())
    {
        output += Heltec.LoRa.readString();
    }

    return output;
}

void comm::closeComm()
{
    Heltec.LoRa.end();
}
