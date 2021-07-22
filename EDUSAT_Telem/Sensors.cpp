// ====================
// Libraries
// ====================
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

void Sensor::setNum(int pin)
{
    sNum = pin;
}

void Sensor::setType(char type)
{
    sType = type;
}

float Sensor::getValue()
{
    return sValue;
}

char Sensor::getType()
{
    return sType;
}

void Sensor::voltageCalculator(float curVal, int v)
{
  if (v == 0 || v == 1) { //3V3 and 5V
    sValue = curVal;
  } else if (v == 2 || v == 3) { //Input and Sys
    sValue = curVal * 3;
  } else if (v == 4) { //Battery
    sValue = curVal * 1.7;
  } else if (v == 5) { //9V
    sValue = curVal * 2;
  } else {
    sValue = 0;
  }
}

void Sensor::currentCalculator(float curVal, int j)
{
  if (j == 0 || j == 1 || j == 2 || j == 3 || j == 4 || j == 5) {
    sValue = curVal * (1.0/CURRENT_GAIN);   
  } else {
    sValue = curVal * (1.0/CURRENT_GAIN);   
  }
}

//TODO: Un-hardcode these temperature constants, and measure the Vin term from them 
void Sensor::temperatureCalculator(float curVal, int t)
{
    //Calculate equivalent resistance of thermistor
    float Rt = 10000 * ((5 / curVal) - 1); //curVal is the Vout (the measured output voltage from thermistor)
    sValue = (1 / ((1 / 298.15) + (log(Rt / 2000) / 3500))) - 273.15; //In C
}
