#ifndef MUX_H
#define MUX_H

// ====================
// Libraries
// ====================#
#include <Arduino.h>
#include <stdint.h>
#include <math.h>


// ====================
// Constant Definitions
// ====================
#define MUX_SIZE 16    //Number of MUX channels

//Digital pins
#define MUX_PIN_1 5    //Mux control/signal pin
#define MUX_PIN_2 4    //Mux control/signal pin
#define MUX_PIN_3 3    //Mux control/signal pin
#define MUX_PIN_4 2    //Mux control/signal pin

//Analog pins
#define MUX_PIN_D A1   //Mux signal pin

// =================
// Class Definitions
// =================
class MultiPlex {
    private:
        int muxSize;
        int controlPins[4];
        int sigPin;
        int muxChannels[16][4]{{0, 0, 0, 0},
        {1, 0, 0, 0},
        {0, 1, 0, 0},
        {1, 1, 0, 0},
        {0, 0, 1, 0},
        {1, 0, 1, 0},
        {0, 1, 1, 0},
        {1, 1, 1, 0},
        {0, 0, 0, 1},
        {1, 0, 0, 1},
        {0, 1, 0, 1},
        {1, 1, 0, 1},
        {0, 0, 1, 1},
        {1, 0, 1, 1},
        {0, 1, 1, 1},
        {1, 1, 1, 1}};

    public:
        MultiPlex(int size, int sig1, int sig2, int sig3, int sig4, int data);
        MultiPlex();
        ~MultiPlex() {};

        float readMux(int channel);
};

#endif
