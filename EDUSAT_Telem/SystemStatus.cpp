// ====================
// Libraries
// ====================
#include <Arduino.h>
#include <stdint.h>
#include <math.h>
#include "SystemStatus.h"
#include "MUX.h"
#include "Sensors.h"

// =================
// SystemStatus Class
// =================
SystemStatus::SystemStatus(): mux(MUX_SIZE, MUX_PIN_1, MUX_PIN_2, MUX_PIN_3, MUX_PIN_4, MUX_PIN_D)
{
    //Serial.begin(9600);
    //Serial.println("In the system status constructor");
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
        Serial.print('-');
        Serial.print(voltages[i].getValue());
        Serial.print(DELIMITER);
    }
    Serial.print(currents[0].getType());
    for (int i = 0; i < I_SENSE_SIZE; i++)
    {
        Serial.print(i);
        Serial.print('-');
        Serial.print(currents[i].getValue());
        Serial.print(DELIMITER);
    }
    Serial.print(temperatures[0].getType());
    for (int i = 0; i < T_SENSE_SIZE; i++)
    {
        Serial.print(i);
        Serial.print('-');
        Serial.print(temperatures[i].getValue());
        Serial.print(DELIMITER);
    }
    Serial.println(FOOTER);
}
