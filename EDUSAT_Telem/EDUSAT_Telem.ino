// ====================
// Libraries
// ====================
#include <math.h>
#include "SystemStatus.h"
#include "Sensors.h"

// ====================
// Constant Definitions
// ====================
const unsigned long interval = 1000;
static unsigned long currentMillis;
unsigned long int counter = 0;

// ====================
// Required Parameters
// ====================
SystemStatus edusat_system;

// =================
// Arduino Functions
// =================
//Arduino setup:
void setup() {
    // Setup control on pins D2, D3, D4, D5 for MUX bit control
    pinMode(MUX_PIN_1, OUTPUT);
    pinMode(MUX_PIN_2, OUTPUT);
    pinMode(MUX_PIN_3, OUTPUT);
    pinMode(MUX_PIN_4, OUTPUT);
    pinMode(MUX_PIN_D, INPUT);

    //Start with write to low on all control pins
    digitalWrite(MUX_PIN_1, LOW);
    digitalWrite(MUX_PIN_2, LOW);
    digitalWrite(MUX_PIN_3, LOW);
    digitalWrite(MUX_PIN_4, LOW);

    /*
    //Ensure all other analog pins are low to reduce chance of noise
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
    digitalWrite(A7, LOW); */

    //Set the baud rate
    Serial.begin(9600); 
}

//Sensing loop:
void loop() {
    edusat_system.updateStatus();
    delay(POLE_TIME);
    edusat_system.sendTelemtry();
} 
