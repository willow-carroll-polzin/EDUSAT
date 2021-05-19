# EDUSAT: A Flatsat Electrical Power System
### Team Members - Carleton University | Department of Mechanical & Aerospace Engineering
+ Max Polzin 
+ Keyanna Coghlan 
+ Hooman Jazebizadeh

This document outlines the design of software and hardware for a eletrical power distribution system (EPS) used in "flatsat", a teaching aid simulating a cubesat, aimed for class-room use. This repository contains the telemetry, control, and interface software for this system.

The two main sections of this repo are the EDUSAT Web Application Code (in the folder "EDUSAT_App"), and the EDUSAT Telemetry code for MCU data collection (in the folder "EDUSAT_Telem").

## Installation and setup:
To set up this project:
1. Install nodejs
2. Install yarn
3. Run the EDUSAT.bat file. Two new command prompt windows will open up, as well as a webpage in your browser at *localhost:8085*
4. If you close the command prompt windows, the GUI will no longer work. Keep them open.

### External Resources
**Software Installation Links:** [ADD SOFTWARE USED]

## Repo Contents:
- **EDUSAT.bat**: Main script needed to be excuted, launches web-app.
- **Hardware**: All hardware documentation.
- **EDUSAT_App**: Talks to MCU and gathers data via serial port, sends data to a server and another client recieves this data and displays it on a webpage.
    - *serial*: Local client responsible for serial communcation.
        - *src*:
            - index.tsx: Sets up websockets to connect to server, also deals with serial communication to MCU.
            - interfaces.ts: Data structure definitions.
    - *socket_server*: Locally hostedn server for communication between serial and webpage clients.
        - *src*:
            - main.ts: Creates a Socket.IO server (nodejs), also handles writing of data to csv.
            - interfaces.ts: Data structure definitions.
    - *webpage*: Local client responsible for displaying webpage.
        - *src*:
            - App.tsx: Creates React components for the GUI.
            - interfaces.ts: Data structure definitions.
            - index.tsx: Connects to Socket.IO server and handles all graphs in the GUI.
            - index.html: Defines webpage structure.
            - style.css: Defines style for webpage.
- **EDUSAT_Telem**: Gathers data from circuit using voltage, current, and temperature sensors and sends it via serial connetion to a connected computer.
    - *EDUSAT_Telem.ino*: Main control logic to read and write data to serial ports and GPIO pins of the MCU.
    - *MUX.cpp*: Class file to describe multiplexer (MUX) behaviour.
    - *MUX.h*: Header describing MUX class. 
    - *Sensors.cpp*: Class file to describe a individual sensor.
    - *Sensors.h*: Header describing sensors class. 
    - *SystemStatus.cpp*: Class file for which coordinates individual sensor objects and MUX object.
    - *SystemStatus.h*: Header describing systemstatus class. 

## EDUSAT Hardware
The main components of EDUSAT can be seen in the diagram below:

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/Hardware/edusat_blockdiagram.png?raw=true)

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/Hardware/edusat_sensors.png?raw=true)

More detailed schematics can be found in the following sections.

### Maximum Peak Power Tracking (MPPT):

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/Hardware/edusat_mppt.png?raw=true)

!UPDATE WITH NEW VALUES!

### DC-DC Conversion:

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/Hardware/edusat_dcdc.png?raw=true)

### Telemetry:

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/Hardware/edusat_telem.png?raw=true)

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/Hardware/edusat_sense.png?raw=true)

!UPDATE!

### EDUSAT Prototypes - (V1.0):
A prototype version is pictured below:

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/Hardware/edusat_protoV1.png?raw=true)

Note the colours around each component:
+ RED = MPPT and system input (either through a solar panel or a PSU).
+ BLUE = Telemetry boards, the one on the left is full of current sensors and amplifiers. The one on the right has the voltage divider, MUX, and arduino. Headers are used to connect the current sensing board and temperature sensors to the MUX.
+ Green = DC-DC conversion and system output. The top board is the 9V buck-boost, then the 3V3 and 5V boards are mounted side by side on the telemetry board.
+ Yellow = A 800 mAH 2S 7.4V Lipo in a 3D printed mount and a extra board that serves as a junction between all the components.

### Bill of Materials:
#### MPPT Components
|Component | Part Number | Description | Source |
| --- | --- | --- | --- |

#### DC-DC Conversion Components
|Component | Part Number | Description | Source |
| --- | --- | --- | --- |
|Sparkfun Buck-Boost Converter | COM15208 | Buck Boost Convert with Variable output (3.3V, 5V, or custom) | [Digikey](https://www.digikey.ca/en/products/detail/sparkfun-electronics/COM-15208/10187090?s=N4IgTCBcDaIMYHsC2BaAjAVjABgBwgF0BfIA)
|Variable Output Buck-Boost Converter| - | 5V to 30V input, 1.25V to 30V output, DC-DC Converter | [Amazon](https://www.amazon.ca/Converter-Step-Down-Automatic-Adjustable-Stabilizer/dp/B07PWCKM5Z/ref=sr_1_3_sspa?dchild=1&keywords=buck+boost+converter&qid=1621027169&sr=8-3-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExNzhDUEtURFo1VTY4JmVuY3J5cHRlZElkPUEwMzUyMDkzM0RBSDNGWUxSWVlMUyZlbmNyeXB0ZWRBZElkPUEwNzM5MDg4MzhSSk40OFBRVjI0VSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=)

### Telemetry components
|Component | Part Number | Description | Source |
| --- | --- | --- | --- |
|Sparkfun MUX | BOB-09056 | 16 Channel Analog to Analog Mux | [Digikey](https://www.digikey.ca/en/products/detail/sparkfun-electronics/BOB-09056/5673767)

## EDUSAT Software - Data Collection via Microcontroller
EDUSAT's telemetry in the form of voltages, currents, and temperatures are gathered on the MCU. This data is then sent via serial port to the client running on the connected computer. 

### Flashing the MCU
The MCU can be easily flashed using the Arduino IDE's built in tools or through VS Code's Arduino Extension. See this [link](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-arduino) for more information on the extension.

### Adding more sensors
The number of sensors being read is currently limited by the number of channels on the CD74HC4067 MUX ([link](https://www.sparkfun.com/products/9056). Currently 16 sensors are used, the *SystemStatus* object keeps a list of the voltage, current, and temperature sensors. The size is set via the V_SENSE_SIZE, I_SENSE_SIZE, T_SENSE_SIZE parameters in SystemStatus.h.

### Using the MCU
Data from the sensors is updated via the SystemStatus's *updateStatus* function. Telemetry is then sent over the serial connection using the *sendTelemtry* function. Note that this data is sent in the following format:

* ```H,0-V,...,5-V,0-C,...,5-C,0-T,...,3-T,F```

Where the *V,C, and T* represent a integer voltage, current, or temperature. The H and F are used to denote the start and end of a individual message.

### Sensor Measurements
**Voltage Sensors**: Voltage sensing is achieved by simply connecting various points of the system to the pins of the MUX. Since the arduino is limited to 5V on its digital and analog pins some votlage dividers are used when measuring certain parts of the system. For example the 9V DC-DC output is measured and run through a voltage divider to ensure the pins of the Arduino are not damaged. The calculations to convert the reduced voltage back to the actual value at the test point are found below for each sensor in the circuit.

[ADD TABLE]

**Current Sensors**: Current sensing is achieved using the MA4080 in series with various points throughout the system. Since the measured currents are sometimes small and the MAX4080 outputs a voltage equivalent to the measured current, ???? amplifiers are added between the current sensors and the MUX to allow for a more realiable measurement on-board the Arduino. The calculation to convert these measurements back to current is shown below.

[ADD Calculation]

**Temperature Sensors**: ???? thermistors are used to measure temperature at various points throughout the system. These are mechanically mounted on various IC's such as the LT???? used in the MPPT system. The circuitry for the thermistors is very similar to that of the voltage dividers, as such the measured signal is fed directly into the MUX and small calculation is performed by the Arduino to convert the measured voltage to a temperature, as shown below.

[ADD Calculation]

## EDUSAT Software - WebApp
EDUSAT's main interface is a web-client that can be viewed in any web browser and launched from any computer. In order to launch and open the app, follow the instructions below:

### Prerequisites
In order to function properly, yarn (a package manager) must be installed. To do this, visit this [link](https://classic.yarnpkg.com/en/docs/install/#windows-stable).

If you do not already have nodejs installed, you will need to do so using this [link](https://nodejs.org/en/download/). Nodejs allows for Javascript and Typescript to be excuted outside of the browser.

Once nodejs and yarn have been successfully installed, continue on to the next steps.

### Bash Script Setup
In the main folder, there is a bash script (" .sh" extension). To run this script, simply double click the script file in your file explorer. If the computer that you are running on does not allow you run bash scripts, follow the command line setup instructions below

### Alternate Command line set up (to use if the bash script cannot execute)
1. Open up a command prompt
2. Navigate to the "EDUSAT_App" folder
3. Type the following command and press enter:  ```start cd serial && start cd socket_server && cd webpage```
5. Now there are three instances of command prompt running, one in each subfolder of the EDUSAT_App 
6. In the command prompt window in the ```serial``` subfolder, type the following commands, pressing enter after each command. Note: this may not work if you do not have an arduino connected, as an arduino is necessary for monitoring the system. For running the entire system, you must be connected to the onboard arduino.
    * ```yarn setup```
    * ```yarn build```
    * ```yarn start```
7. In the command prompt window in the ```socket_server``` subfolder, type the following commands, pressing enter after each command:
    * ```yarn setup```
    * ```yarn build```
    * ```yarn start```
8. In the command prompt windows in the ```webpage``` subfolder, type the following commands, pressing enter after each command:
    * ```yarn setup```
    * ```yarn serve```
9. In this command prompt as the previous step, you should see something similar to the following:
    * ```yarn run v1.22.4```
    * ```$ parcel serve --port 8085 src/index.html```
    * ``` Server running at http://localhost:8085```
10. In a web browser, go to the address on the last line, either by copying and pasting, or by clicking the address itself in your command prompt window

### Using the Web Client
After setting up the web client using either the bash script or the command line instructions provided aobve, you will be able to access the web-client through the web browser.

To select which data points are being graphed on each graph, toggle each dataset on and off by clicking on their legend entry.

To download the data into a csv:
* Click the "Prepare CSV" Button
* Click the "DOWNLOAD BUTTON" and a .csv file named with the current date and time will be downloaded to your computer. It will contain all data entries since the last time data was prepared and downloaded

### Closing the System
Once done with the system, it can be closed by pressing ```CTRL+C``` in each command prompt browser, followed by: ```y```  then ```ENTER``` when the command prompt asks if you wish to terminate the program.

## Note
If issues arise during the setup, installation, or use of this code, feel free to contact: keyanna.coghlan@carleton.ca or max.polzin@carleton.ca.
