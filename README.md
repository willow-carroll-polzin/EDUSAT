# EDUSAT
---
A eletrical power distribution system (EPS) for a FLAT-SAT aimed for class-room use. This repository contains the telemetry, control, and interface software for this system.
The two main sections of this repo are the EDUSAT Web Application Code (in the folder "EDUSAT_App"), and the EDUSAT Telemetry code for MCU data collection (in the folder "EDUSAT_Telem").

## EDUSAT App

The EDUSAT App is a web-client that can be seen in any local web browser and launched from any computer. In order to launch and open the app, follow the instructions below

### Prerequisites
In order to function properly, yarn must be installed first. To do this, visit this [link](https://classic.yarnpkg.com/en/docs/install/#windows-stable).

If you do not already have nodejs installed, you will need to do so using think [link](https://nodejs.org/en/download/).

Once nodejs and yarn have been successfully installed, continue on to the next steps.
### Bash Script Setup
In the provided folder, there is a bash script, " .sh". To run this script, simply double click the script file in windows explorer. If the computer that you are running on does not allow you run bash scripts, follow the command line setup instructions below

### Command line set up (to use if the bash script cannot execute)
1. Open up a command prompt
2. Navigate to the "EDUSAT_App" folder
3. Type the following command and press enter:  ```start cd serial && start cd socket_server && cd webpage```
5. Now there are three instances of command prompt running, one in each subfolder of the EDUSAT_App 
6. In the command prompt window in the ```serial``` subfolder, type the following commands, pressing enter after each command:
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



### Modifying the App

## Setup

## Output Format

## Examples
+
