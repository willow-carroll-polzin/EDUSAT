// ====================
// Libraries
// ====================
#include <Arduino.h>
#include <stdint.h>
#include <math.h>
#include "SystemStatus.h"
#include "Sensors.h"

// =================
// Multiplex Class
// =================
MultiPlex::MultiPlex() {
    muxSize = 16;
    controlPins[0] = 2;
    controlPins[1] = 3;
    controlPins[2] = 4;
    controlPins[3] = 5;
    dataPin = 6;
    int binaryChannels[16][4] = {
        {0, 0, 0, 0}, //channel 0
        {1, 0, 0, 0}, //channel 1
        {0, 1, 0, 0}, //channel 2
        {1, 1, 0, 0}, //channel 3
        {0, 0, 1, 0}, //channel 4
        {1, 0, 1, 0}, //channel 5
        {0, 1, 1, 0}, //channel 6
        {1, 1, 1, 0}, //channel 7
        {0, 0, 0, 1}, //channel 8
        {1, 0, 0, 1}, //channel 9
        {0, 1, 0, 1}, //channel 10
        {1, 1, 0, 1}, //channel 11
        {0, 0, 1, 1}, //channel 12
        {1, 0, 1, 1}, //channel 13
        {0, 1, 1, 1}, //channel 14
        {1, 1, 1, 1}  //channel 15
    };
    *muxChannels = &binaryChannels;
}

MultiPlex::MultiPlex(int size, int sig1, int sig2, int sig3, int sig4, int data)
{
    muxSize = size;
    controlPins[0] = sig1;
    controlPins[1] = sig2;
    controlPins[2] = sig3;
    controlPins[3] = sig4;
    dataPin = data;
    int binaryChannels[16][4] = {
        {0, 0, 0, 0}, //channel 0
        {1, 0, 0, 0}, //channel 1
        {0, 1, 0, 0}, //channel 2
        {1, 1, 0, 0}, //channel 3
        {0, 0, 1, 0}, //channel 4
        {1, 0, 1, 0}, //channel 5
        {0, 1, 1, 0}, //channel 6
        {1, 1, 1, 0}, //channel 7
        {0, 0, 0, 1}, //channel 8
        {1, 0, 0, 1}, //channel 9
        {0, 1, 0, 1}, //channel 10
        {1, 1, 0, 1}, //channel 11
        {0, 0, 1, 1}, //channel 12
        {1, 0, 1, 1}, //channel 13
        {0, 1, 1, 1}, //channel 14
        {1, 1, 1, 1}  //channel 15
    };
    *muxChannels = &binaryChannels;
}

float MultiPlex::readMux(int channel)
{
    Serial.begin(9600);
    //Loop through all 4 digital "signal" pins to set the mux Channel (channel=1<->16)
    for (int j = 0; j < 4; j++)
    {
        Serial.println((*muxChannels));
        //digitalWrite(controlPins[j], (*muxChannels)[channel][j]);
    }

    //Read current MUX output from the data pin based on selected channel
    int val = analogRead(dataPin) * (5.0 / 1023.0);

    //Return the current value
    return val;
}

// =================
// SystemStatus Class
// =================
//===================================================================================
SystemStatus::SystemStatus(): mux(MUX_SIZE, MUX_PIN_1, MUX_PIN_2, MUX_PIN_3, MUX_PIN_4, MUX_PIN_D)
{
    //Serial.begin(9600);
    for (int i = 0; i < 6; i++) {
      //test comment
        voltages[i].setNum(i);
        voltages[i].setType('v');
        currents[i].setNum(i);
        currents[i].setType('c'); 
        if (i < 4) {
            temperatures[i].setNum(i);
            temperatures[i].setType('t');
        }
    }
    mode = true;
    mux.readMux(1);
}

void SystemStatus::setMode(bool cmd)
{
    mode = cmd;
}

void SystemStatus::updateStatus()
{
    int v,j,t = 0; //Voltage, Current, Temperature counters

    for (int i = 0; i < MUX_SIZE; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 6 || i == 8 || i == 10) { 
            voltages[v].voltageCalculator(mux.readMux(i));
            v++;
        }
        else if (i == 1 || i == 3 || i == 5 || i == 7 || i == 9 || i == 11) { 
            currents[j].currentCalculator(mux.readMux(i));
            j++;
        }
        else if (i == 12 || i == 13 || i == 14 || i == 15) { 
            temperatures[v].temperatureCalculator(mux.readMux(i));
            t++;
        }
    }
}

void SystemStatus::sendTelemtry()
{
     Serial.print(HEADER);
     Serial.print(voltages[0].getType());
    for (int i = 0; i < V_SENSE_SIZE; i++)
    {
        Serial.print(i);
        Serial.print(voltages[i].getValue());
        Serial.print(DELIMITER);
    }
    Serial.print(currents[0].getType());
    for (int i = 0; i < I_SENSE_SIZE; i++)
    {
        Serial.print(i);
        Serial.print(currents[i].getValue());
        Serial.print(DELIMITER);
    }
    Serial.print(temperatures[0].getType());
    for (int i = 0; i < T_SENSE_SIZE; i++)
    {
        Serial.print(i);
        Serial.print(temperatures[i].getValue());
        Serial.print(DELIMITER);
    }
    Serial.println(FOOTER);
}
