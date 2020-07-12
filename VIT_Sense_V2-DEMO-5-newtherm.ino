//////////////////////////////////////////////////////////////////////////
//Libraries
#include <math.h>

/*   MUX variables    */
//Mux control/signal pins
int c0 = 2;
int c1 = 3;
int c2 = 4;
int c3 = 5;

//Arduino control array, assign these signal pins to intended bit values to select MUX channel
int controlPin[] = {c0, c1, c2, c3};

//MUX output vars
int SIG_pin = A0; //Read MUX outputs from "SIG" pin
float curVal = 0; //Recorded current value of function for processing

//MUX channel array, send these bits through D2,D3,D4,D5 signal pins to spec channel
int muxChannel[16][4] = {
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

/*   Voltage variables    */
float *V = 0; //Calculated voltage

/*   Current variables    */
int currentLoad = 1.2; //1 Ohm resistor acting as Rref (+/-5%)            ***ASSUMED TO = 1 Ohm***

float *I = 0; //Calculated current

/*   Temperature variables    */
float Vin = 5;          //Theoretical Source voltage supplied (V) ***ASSUMED TO = 5V***
float thermRef = 10000; //Reference resistor voltage (Ohm)        ***SET TO 1 kOhm***
float Rt = 0;           //Measured thermistor resistance (Ohm)

float B = 3500;         //Stein-Hart constant (K)
float T0 = 25 + 273.15; //Ambient temperature (K)
float R0 = 2000;        //Resistance of thermistor at ambient

float *T = 0; //Temperature calulated based on Rt, in Kelvin (K)

//////////////////////////////////////////////////////////////////////////
//Arduino setup:
void setup() {
    // Setup control on pins D2, D3, D4, D5 for MUX bit control
    pinMode(c0, OUTPUT);
    pinMode(c1, OUTPUT);
    pinMode(c2, OUTPUT);
    pinMode(c3, OUTPUT);
    pinMode(SIG_pin, INPUT);

    pinMode(A1, OUTPUT);
    digitalWrite(A1, LOW);
    pinMode(A2, OUTPUT);
    digitalWrite(A2, LOW);
    pinMode(A3, OUTPUT);
    digitalWrite(A3, LOW);
    pinMode(A4, OUTPUT);
    digitalWrite(A4, LOW);
    pinMode(A5, OUTPUT);
    digitalWrite(A5, LOW);
    pinMode(A6, OUTPUT);
    digitalWrite(A6, LOW);
    pinMode(A7, OUTPUT);
    digitalWrite(A7, LOW);

    //Start with write to low on all control pins
    digitalWrite(c0, LOW);
    digitalWrite(c1, LOW);
    digitalWrite(c2, LOW);
    digitalWrite(c3, LOW);

    Serial.begin(9600); 
}

//////////////////////////////////////////////////////////////////////////
//Sensing loop:
void loop() {
    //Loop through and read all 16 channels from MUX
    for (int i = 0; i < 2; i++) {
        Serial.print("Value at channel ");
        Serial.print(i);
        Serial.print(" is : ");
        Serial.print(readMux(i));
        curVal = readMux(i) * (5.0 / 1023.0);
        Serial.print(" - ");
        Serial.print(curVal);

        if (i == 0 || i == 2 || i == 4 || i == 6 || i == 8 || i == 10) { //If current channel is measuring voltage (V)
            voltageCal(curVal, V);
        }
        else if (i == 1 || i == 3 || i == 5 || i == 7 || i == 9 || i == 11) { //If current channel is measuring current (Ohm)
            currentCal(curVal, I);
        }
        else if (i == 12 || i == 13 || i == 14 || i == 15) { //If current channel is measuring temperature (K)
            tempCal(curVal, T);
        }
        delay(1000); //Delay between channel loops
    }
}

//////////////////////////////////////////////////////////////////////////
//Supporting Functions:
//Function to read MUX IO and select channels
int readMux(int channel) {
    //Loop through all 4 digital "signal" pins to set the mux Channel (channel=1<->16)
    for (int j = 0; j < 4; j++) {
        digitalWrite(controlPin[j], muxChannel[channel][j]);
    }

    //Read current MUX output from the SIG pin based on selected channel
    int val = analogRead(SIG_pin);

    //Return the current value
    return val;
}

//Function to take in a input voltage and temprature and resistance from thermistor
void tempCal(float curValue, float *T) {
    float Tlocal = 0;
    //Calculate equivalent resistance of thermistor
    Rt = thermRef * ((Vin / curValue) - 1);                  //curValue is the Vout (the measured output voltage from thermistor)
    Tlocal = (1 / ((1 / T0) + (log(Rt / R0) / B))) - 273.15; //In C
    T = &Tlocal;

//Function to take in a input voltage and output current across shunt
void currentCal(float curValue, float *I) {
    float Ilocal = 0;

    //Calculate the actual current measured (MAX4080 outputs a voltage equal to measured current)
    float G = 2; //Gain from amp
    Ilocal = curValue / G;
    
    I = &Tlocal;
}

//Function to read in a input voltage and normalize it based on voltage divider
void voltageCal(float curValue, float *V) {
    V = curValue;
}

//Function to give system status
void sendStatus(float *V, float *I, float *T) {
    Serial.print(" -- Voltage (V): ")
    Serial.println(curValue);
}
//////////////////////////////////////////////////////////////////////////