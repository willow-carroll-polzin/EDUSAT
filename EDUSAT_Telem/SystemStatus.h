#ifndef SYSTEMSTATUS_H
#define SYSTEMSTATUS_H

// ====================
// Libraries
// ====================#
#include <stdint.h>
#include "Sensors.h"

// ====================
// Constant Definitions
// ====================
#define V_SENSE_SIZE 6 //Number of voltage sensors
#define I_SENSE_SIZE 6 //Number of current sensors
#define T_SENSE_SIZE 4 //Number of temperature sensors

#define MUX_SIZE 16    //Number of MUX channels
#define MUX_PIN_1 2    //Mux control/signal pin
#define MUX_PIN_2 3    //Mux control/signal pin
#define MUX_PIN_3 4    //Mux control/signal pin
#define MUX_PIN_4 5    //Mux control/signal pin
#define MUX_PIN_D A0    //Mux data pin

#define DATA_SIZE 7    //String length for each data type
#define DECI_SIZE 2    //Number of decialmal points
#define POLE_TIME 1000 //System polling time

#define HEADER "H"
#define DELIMITER ","
#define FOOTER "F"

// =================
// Class Definitions
// =================
//===================================================================================
class SystemStatus {
    private:
        Sensor voltages[V_SENSE_SIZE];
        Sensor currents[I_SENSE_SIZE];
        Sensor temperatures[T_SENSE_SIZE];

        bool mode;

        MultiPlex mux;

    public:
        SystemStatus(uint8_t pin, char type);
        ~SystemStatus() {};

        void setMode(bool mode);
        void updateStatus();
        void sendTelemtry();
};

class MultiPlex {
    private:
        uint8_t muxSize;
        uint8_t controlPins[4];
        uint8_t dataPin;
        int muxChannels[16][4];

    public:
        MultiPlex(int size, uint8_t sig1, uint8_t sig2, uint8_t sig3, uint8_t sig4);
        ~MultiPlex() {};

        float readMux(int channel);
};
#endif
