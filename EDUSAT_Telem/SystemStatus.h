#ifndef SYSTEMSTATUS_H
#define SYSTEMSTATUS_H

// ====================
// Libraries
// ====================#
#include <stdint.h>
#include "Sensors.h"
#include "MUX.h"

// ====================
// Constant Definitions
// ====================
#define V_SENSE_SIZE 6 //Number of voltage sensors
#define I_SENSE_SIZE 6 //Number of current sensors
#define T_SENSE_SIZE 4 //Number of temperature sensors

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
        SystemStatus();
        ~SystemStatus() {};

        void setMode(bool mode);

        Sensor getVoltages(int i);
        Sensor getCurrents(int i);
        Sensor getTemperatures(int i);
        
        void updateStatus();
        void sendTelemtry();
        int v,j,t=0;
};
#endif
