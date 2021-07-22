#ifndef SENSORS_H
#define SENSORS_H

// ====================
// Libraries
// ====================
#include <Arduino.h>
#include <stdint.h>
#include <math.h>

// ====================
// Constant Definitions
// ====================
#define SENSOR_STATUS_PIN 10

#define VOLTAGE_REF 1 //0 Ohm resistor acting as Rref (+/-5%)

#define CURRENT_GAIN 3  //Amount of gain applied to measued "current"

#define TEMP_VIN 5            //Theoretical Source voltage supplied (V) ***ASSUMED TO = 5V***
#define TEMP_REF 10000;       //Reference resistor voltage (Ohm)        ***SET TO 1 kOhm***
#define TEMP_B 3500;          //Stein-Hart constant (K)
#define TEMP_AMB 298.15;      //Ambient temperature (K), 25 + 273.15
#define TEMP_MES_AMB 2000;    //Resistance of thermistor at ambient

// =================
// Class Definitions
// =================
//===================================================================================
class Sensor
{
private:
    char sType;
    int sNum;
    float sValue;

public:
    Sensor(int pin, char type);
    Sensor();
    ~Sensor(){};

    //Get values and sensor types
    void setNum(int pin);
    void setType(char type);
    float getValue();
    char getType();

    //Update current sensor values
    void voltageCalculator(float recentVoltage, int v);
    void currentCalculator(float recentCurrent, int j);
    void temperatureCalculator(float recentTemperature, int t);
};

#endif
