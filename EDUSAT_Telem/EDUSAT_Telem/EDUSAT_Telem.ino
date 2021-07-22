// ====================
// Libraries
// ====================
#include <math.h>
#include "SystemStatus.h"

// ====================
// Constant Definitions
// ====================
const unsigned long interval = 1000;
unsigned long int counter = 0;

// ====================
// Required Parameters
// ====================
SystemStatus edusat_system;

// Arduino Functions
// =================
//Arduino setup:
void setup() {
    //Set the baud rate
    Serial.begin(115200);

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
}

//Sensing loop
void loop() {
    edusat_system.updateStatus();
    edusat_system.sendTelemtry();
} 
