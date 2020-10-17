#include "display.h"

using namespace std;

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

/**
 * writes characters to display
 */
void display::write(String str)
{
    Heltec.display->drawString(0, 0, str);
    Heltec.display->display();
}

/**
 * writes characters to display at line number
 */
void display::write(int line, String str)
{
    Heltec.display->drawString(0, line * 12, str);
    Heltec.display->display();
}

/**
 * writes characters at line number and x coordinate
 */
void display::write(int x, int y, String str)
{
    Heltec.display->drawString(2 * x, 15 * y, str);
    Heltec.display->display();
}