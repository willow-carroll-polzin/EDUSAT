#ifndef MUX_H
#define MUX_H

// ====================
// Libraries
// ====================#
#include <stdint.h>

// ====================
// Constant Definitions
// ====================
#define MUX_SIZE 16    //Number of MUX channels
#define MUX_PIN_1 2    //Mux control/signal pin
#define MUX_PIN_2 3    //Mux control/signal pin
#define MUX_PIN_3 4    //Mux control/signal pin
#define MUX_PIN_4 5    //Mux control/signal pin
#define MUX_PIN_D A0    //Mux data pin

// =================
// Class Definitions
// =================
//===================================================================================
class MultiPlex {
    private:
        int muxSize;
        int controlPins[4];
        int dataPin;
        int *muxChannels;

    public:
        MultiPlex(int size, int sig1, int sig2, int sig3, int sig4, int data);
        MultiPlex();
        ~MultiPlex() {};

        float readMux(int channel);
};

#endif
