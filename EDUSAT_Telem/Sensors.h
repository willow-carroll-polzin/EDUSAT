#ifndef SENSORS_H
#define SENSORS_H

// ====================
// Libraries
// ====================
#include <stdint.h>

// ====================
// Constant Definitions
// ====================
#define SENSOR_STATUS_PIN 10

#define VOLTAGE_REF 0 //0 Ohm resistor acting as Rref (+/-5%)

#define CURRENT_REF 1.2 //1 Ohm resistor acting as Rref (+/-5%)
#define CURRENT_GAIN 2 //Amount of gain applied to measued "current"

#define TEMP_VIN 5              //Theoretical Source voltage supplied (V) ***ASSUMED TO = 5V***
#define TEMP_REF = 10000;       //Reference resistor voltage (Ohm)        ***SET TO 1 kOhm***
#define TEMP_B = 3500;          //Stein-Hart constant (K)
#define TEMP_AMB = 25 + 273.15; //Ambient temperature (K)
#define TEMP_MES_AMB = 2000;    //Resistance of thermistor at ambient

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
    Sensor(uint8_t pin, char type);
    ~Sensor(){};

    void updateValue();
    char getType();
    void voltageCalculator(float recentVoltage, char type);
    void currentCalculator(float recentCurrent, char type);
    void temperatureCalculator(float recentTemperature, char type);
};

#endif
