#ifndef DISPLAY_H_
#define DISPLAY_H_

#include "heltec.h"
#include "Arduino.h"

namespace display
{
    extern void initializeOLED();
    extern void clear();
    extern void write(String str);
    extern void write(int line, String str);
    extern void write(int x, int y, String str);
} // namespace display
#endif