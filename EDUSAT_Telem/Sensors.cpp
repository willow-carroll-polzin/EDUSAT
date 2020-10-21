// ====================
// Libraries
// ====================
#include <Arduino.h>
#include <stdint.h>
#include <math.h>
#include "Sensors.h"

// =================
// Sensor Class
// =================
Sensor::Sensor()
{
    sType = 'f';
    sNum = 0;
    sValue = 0;
}

Sensor::Sensor(int num, char type)
{
    sType = type;
    sNum = num;
    sValue = 0;
}

// This method 
float Sensor::getValue()
{
    return sValue;
}

char Sensor::getType()
{
    return sType;
}

void Sensor::voltageCalculator(float curVal)
{
    sValue = curVal * VOLTAGE_REF; //TODO: CHECK IF THE VOLTAGE REF IS 0!!!!!!!
}

void Sensor::currentCalculator(float curVal)
{
    sValue = curVal * (1.0/CURRENT_GAIN);
}

//TODO: Un-hardcode these temperature constants, and measure the Vin term from the 
//Correct voltage sensor so it is more accurate!
void Sensor::temperatureCalculator(float curVal)
{
    //Calculate equivalent resistance of thermistor
    float Rt = 10000 * ((5 / curVal) - 1); //curVal is the Vout (the measured output voltage from thermistor)
    sValue = (1 / ((1 / 298.15) + (log(Rt / 2000) / 3500))) - 273.15; //In C
}
