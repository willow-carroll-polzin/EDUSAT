// ====================
// Libraries
// ====================
#include <Arduino.h>
#include <stdint.h>
#include <math.h>
#include <iostream>
#include "Sensors.h"

// =================
// Sensor Class
// =================
Sensor::Sensor(int num, char type)
{
    sType = type;
    sNum = num;
    sValue = 0;
}

// This method 
void Sensor::updateValue(float val)
{
    sValue = val;
}

char Sensor::getType()
{
    return sType;
}

void Sensor::voltageCalculator(float curVal)
{
    //If the voltage has been divided, recalculate it
    if (i == 0) {
        sValue= curVal  * VOLTAGE_REF); //TODO: determine which voltages are divided
    }
    sValue = curVal
}

void Sensor::currentCalculator(float curVal)
{
    sValue = curValue * (1.0/CURRENT_GAIN);
}

void Sensor::temperatureCalculator(float curVal)
{
    //Calculate equivalent resistance of thermistor
    const float Rt = TEMP_REF * ((TEMP_VIN / curVal) - 1);                      //curValue is the Vout (the measured output voltage from thermistor)
    temp = (1 / ((1 / TEMP_AMB) + (log(Rt / TEMP_MES_AMB) / TEMP_B))) - 273.15; //In C
    sValue = temp;
}

