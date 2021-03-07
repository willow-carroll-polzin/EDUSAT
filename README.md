# EDUSAT
---
A eletrical power distribution system (EPS) for a FLAT-SAT aimed for class-room use. This repository contains the telemetry, control, and interface software for this system.

## EDUSAT App

The EDUSAT App is a web-client that can be seen in any local web browser and launched from any computer. In order to launch and open the app, follow the instructions below

### Setup and Installation
In order to function properly, yarn must be installed first. To do this, visit this [link](https://classic.yarnpkg.com/en/docs/install/#windows-stable).

If you do not already have nodejs installed, you will need to do so using think [link](https://nodejs.org/en/download/).

Once nodejs and yarn have been successfully installed, continue on to the next steps.
#### Bash Script Setup
In the provided folder, there is a bash script, " .sh". To run this script:. If the computer that you are running on does not allow you run bash scripts, follow the command line setup instructions below

#### Command line set up (to use if the bash script cannot execute)
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



### Starting the parcel server

### Opening the Web Client

### Using the Web Client
To select which graphs are being used

To download the data into a csv



### Modifying the App

## Setup

## Output Format

## Examples
+
