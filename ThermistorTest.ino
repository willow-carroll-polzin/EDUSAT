//Libraries
#include <math.h>

//Input variables
int angI0 = A0; //Input from thermistor
int angI1 = A1; //Checks source voltage
int rT; //Read value from thermistor
int rS; //Read value from source

//Calculated variables
float Vout;                   //Measured output voltage from thermistor (V)
float Vin = 5;                //Theoretical Source voltage supplied (V)
float Vsr;                    //Measured source voltage (v)
float Rref = 10000;           //Reference resistor voltage (Ohm)
float Rt;                     //Measured thermistor resistance (Ohm)
float T;                      //Temperature calulated based on Rt, in Kelvin (K)
float A = 0.001009249522;     //Stein-Hart constant #1
float B = 0.0002378405444;    //Stein-Hart constant #2
float C = 0.0000002019202697; //Stein-Hart constant #3
float D;                      //Intermediate val

//Output variables
float dispR; //Displayed thermistor resistance at current temp (Ohm)
float dispT; //Displayed value from thermistor (C)
float dispS; //Displayed source voltage (V)

void setup() {
  Serial.begin(9200);
}

void loop() {
  //Read voltage out of thermistor
  rT = analogRead(angI0);
  Vout = rT*(5.0/1023.0);

  //Read source volage
  rS = analogRead(angI1);
  Vsr = rS*(5.0/1023.0);
  
  //Calculate equivalent resistance of thermistor
  Rt = Rref*((Vin/Vout)-1);
  dispR = Rt;
  
  //Convert resistance to temperature based on thermistor model
  D = pow(log(Rt),3); //Intermediate val for Stein-Hart equation
  T = (1/(A+B*log(Rt)+C*D));
  dispT = T;
  
  delay(500);
  
  //Display
  Serial.print("Current thermistor resistance: ");
  Serial.print(dispR);
  Serial.println(" Ohm");
  Serial.print("LOCAL TEMPERATURE - ");
  Serial.print(dispT);
  Serial.println(" K");
  Serial.print("Source voltage read as: ");
  Serial.print(dispS);
  Serial.println(" V");
}
