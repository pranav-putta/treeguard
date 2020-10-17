#include "Arduino.h"
#include "display.h"
#include "comm.h"

String data;

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