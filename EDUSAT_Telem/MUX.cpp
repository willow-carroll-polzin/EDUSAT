// ====================
// Libraries
// ====================
#include <Arduino.h>
#include <stdint.h>
#include <math.h>
#include "MUX.h"

// =================
// Multiplex Class
// =================
MultiPlex::MultiPlex(){
    muxSize = 16;
    controlPins[0] = 2;
    controlPins[1] = 3;
    controlPins[2] = 4;
    controlPins[3] = 5;
    dataPin = 6;
    //*muxChannels = &binaryChannels;
}

MultiPlex::MultiPlex(int size, int sig1, int sig2, int sig3, int sig4, int data)
{
    muxSize = size;
    controlPins[0] = sig1;
    controlPins[1] = sig2;
    controlPins[2] = sig3;
    controlPins[3] = sig4;
    dataPin = data;

    //*muxChannels = &binaryChannels;
}

float MultiPlex::readMux(int channel)
{
    //Serial.begin(9600);
    //Loop through all 4 digital "signal" pins to set the mux Channel (channel=1<->16)
    for (int j = 0; j < 4; j++)
    {
        digitalWrite(controlPins[j], muxChannels[channel][j]);
    }

    //Read current MUX output from the data pin based on selected channel
    int val = analogRead(dataPin) * (5.0 / 1023.0);

    //Return the current value
    return val;
}
