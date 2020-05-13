//Libraries
#include <math.h>

//Variables:
//ARDUINO IO
//*************************
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
int muxChannel[16][4]={
  {0,0,0,0}, //channel 0
  {1,0,0,0}, //channel 1
  {0,1,0,0}, //channel 2
  {1,1,0,0}, //channel 3
  {0,0,1,0}, //channel 4
  {1,0,1,0}, //channel 5
  {0,1,1,0}, //channel 6
  {1,1,1,0}, //channel 7
  {0,0,0,1}, //channel 8
  {1,0,0,1}, //channel 9
  {0,1,0,1}, //channel 10
  {1,1,0,1}, //channel 11
  {0,0,1,1}, //channel 12
  {1,0,1,1}, //channel 13
  {0,1,1,1}, //channel 14
  {1,1,1,1}  //channel 15
};
//*************************

//VOLTAGE SENSE
//*************************
//*************************

//CURRENT SENSE
//*************************
//Input variables

//Constant variables
int currentLoad = 1.2;  //1 Ohm resistor acting as Rref (+/-5%)            ***ASSUMED TO = 1 Ohm***

//Output variables
float *I = 0; //Calculated current
//*************************

//TEMPERATURE SENSE
//*************************
//Input variables
float Vin = 5;                //Theoretical Source voltage supplied (V) ***ASSUMED TO = 5V***
float thermRef = 10000;       //Reference resistor voltage (Ohm)        ***SET TO 1 kOhm***
float Rt = 0;                 //Measured thermistor resistance (Ohm)

//Constants
float A = 0.001009249522;     //Stein-Hart constant #1
float B = 0.0002378405444;    //Stein-Hart constant #2
float C = 0.0000002019202697; //Stein-Hart constant #3
float D = 1;                      //Intermediate val

//Output variables
float *T = 0;                     //Temperature calulated based on Rt, in Kelvin (K)
//*************************


//Arduino setup:
void setup(){
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

  Serial.begin(9600); //Allow for monitoring on PC (COM3) at buad rate of 9600
}

//Sensing loop:
void loop(){

  //Loop through and read all 16 channels from MUX
  for(int i = 0; i < 2; i ++){
    Serial.print("Value at channel ");
    Serial.print(i);
    Serial.print(" is : ");
    Serial.print(readMux(i));
    curVal = readMux(i)*(5.0/1023.0);
    Serial.print(" - ");
    Serial.println(curVal);

    if (i==0||i==2||i==4||i==6||i==8||i==10) { //If current channel is measuring voltage (V)
 
    } else if (i==1||i==3||i==5||i==7||i==9||i==11) { //If current channel is measuring current (Ohm)
      
    } else if (i==12||i==13||i==14||i==15) { //If current channel is measuring temperature (K)
      
    }
    
    delay(1000); //Delay between channel loops
  }

}

//Supporting Functions:
//Function to read MUX IO and select channels
int readMux(int channel){
  //Loop through all 4 digital "signal" pins to set the mux Channel (channel=1<->16)
  for(int j = 0; j < 4; j ++){
    digitalWrite(controlPin[j], muxChannel[channel][j]);
  }

  //Read current MUX output from the SIG pin based on selected channel
  int val = analogRead(SIG_pin);
  
  //Return the current value
  return val;
}

//Function to take in a input voltage and temprature and resistance from thermistor
float tempCal(float curValue, float *T) {
  float Tlocal = 0;
  //Calculate equivalent resistance of thermistor
    Rt = thermRef*((Vin/curValue)-1); //curValue is the Vout (the measured output voltage from thermistor)
    D = pow(log(Rt),3); //Intermediate val for Stein-Hart equation
    Tlocal = (1/(A+B*log(Rt)+C*D)); //In K
    T=&Tlocal;
  Serial.println(*T);
  Serial.print("VOL ");
  Serial.println(curValue);
}

//Function to take in a input voltage and output current across shunt
float currentCal(float curValue, float *I) {
  float Ilocal = 0;
  //Calculate equivalent current based on input voltage and load
  Ilocal = curValue/currentLoad;
  I=&Ilocal;
  //*I = 1000;
  Serial.println(*I);
  Serial.print("VOL:  ");
  Serial.println(curValue);
}

//Function to read in a input voltage and normalize it based on voltage divider
float voltageCal(float curValue) {
  Serial.println(curValue);
  return (curValue);
}
