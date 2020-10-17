#ifndef COMM_H_
#define COMM_H_

#include <SPI.h>
#include <Arduino.h>
#include "heltec.h"

#define SYNC_DEF 0xF3

namespace comm
{
    extern void initializeComm();
    extern void sendData(String data, int syncWord = SYNC_DEF, int count = -1);
    extern String listen(int syncWord = SYNC_DEF, int timeout = 100000);
    extern String asyncListen(int syncWord = SYNC_DEF);
    extern void closeComm();
} // namespace comm

#endif