#include "display.h"

using namespace std;

int last_msg_time = 0;
int msg_display_time = 0;
void (*timeoutCallback)(void) = []() {};
bool displayTimedout = false;

/**
 * initializes oled screen and clears the board
 */
void display::initializeOLED()
{
    Heltec.display->setContrast(255);
}

/**
 * empties the oled output
 */
void display::clear()
{
    Heltec.display->clear();
    Heltec.display->display();
}

void display::update()
{
    // clears screen when time for message expires
    if (!displayTimedout && millis() - last_msg_time > msg_display_time)
    {
        clear();
        timeoutCallback();
        displayTimedout = true;
    }
}

/**
 * writes characters to display
 */
void display::write(String str, int time, void (*ptr)(void) )
{
    write(0, 0, str, time, ptr);
}

/**
 * writes characters to display at line number
 */
void display::write(int line, String str, int time, void (*ptr)(void) )
{
    write(0, line, str, time, ptr);
}

/**
 * writes characters at line number and x coordinate
 */
void display::write(int x, int y, String str, int time, void (*ptr)(void) )
{
    Heltec.display->drawString(2 * x, 12 * y, str);
    Heltec.display->display();

    msg_display_time = time;
    last_msg_time = millis();

    timeoutCallback = ptr;
    displayTimedout = time < 0; // if negative time is passed in, the message remains on screen indefinitely
}