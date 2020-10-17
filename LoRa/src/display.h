#ifndef DISPLAY_H_
#define DISPLAY_H_

#include "heltec.h"
#include "Arduino.h"

namespace display
{
    extern void initializeOLED();
    extern void clear();
    extern void update();
    extern void write(String str, int time = 500, void (*timeoutCallback)(void) = []() {});
    extern void write(int line, String str, int time = 500, void (*timeoutCallback)(void) = []() {});
    extern void write(int x, int y, String str, int time = 500, void (*timeoutCallback)(void) = []() {});
} // namespace display
#endif