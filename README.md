# EDUSAT
## A Tabletop Electrical Power System (EPS)
This project was developed as a teaching aid to help students explore the design and function of cubesat EPS systems.

A eletrical power distribution system (EPS) for a FLAT-SAT aimed for class-room use. This repository contains the telemetry, control, and interface software for this system.
The two main sections of this repo are the EDUSAT Web Application Code (in the folder "EDUSAT_App"), and the EDUSAT Telemetry code for MCU data collection (in the folder "EDUSAT_Telem").

## Setup & Launch
To set up this project:
1. Run the node .msi file to install nodejs
2. Run the yarn .msi file to install yarn
3. Run the EDUSAT.bat file. Two new command prompt windows will open up, as well as a webpage in your browser at localhost:8085
4. If you close the command prompt windows, the GUI will no longer work. Keep them open

![alt text](https://github.com/MaxPolzinCU/EDUSAT/blob/master/edusat_hardware.png?raw=true)

### Microcontroller Application

## EDUSAT Hardware

## EDUSAT Data Collection - Microcontroller

////////////////////////////////////////////////////////
## EDUSAT App - Broswer Interface

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

If issues arise during the setup, installation, or use of this code, feel free to contact: keyanna.coghlan@carleton.ca or max.polzin@carleton.ca.

///////////////////////////////////////////////////////
# MAAJ 5308: FINAL PROJECT
## Semantic Map Labelling
### Team Members
Max Polzin

### Overview
This project uses DarkNet's YOLOv3, OpenCV, and the Intel RealSense SDK to perform object detection, localization and mapping of semantic data.

## Setup and Usage:
### Setting up the Environment and Dependencies
1. Unzip the provided file called "SemanticMapLabels.zip" OR visit https://github.com/MaxPolzinCU/SemanticMapLabels and clone the repository
2. Install Python 3.8.5 and Pip 20.0.2 or greater
3. Install the Intel RealSense SDK Python wrapper with the following command: "pip install pyrealsense2"
4. Install the following libraries:
- numpy 1.20.2
- matplotlib 3.4.1
- openCV 4.5.2
5. Clone the official Darknet YOLOv3 repository found at: https://github.com/pjreddie/darknet

Follow the instructions provided in the following link to build the library: https://pjreddie.com/darknet/yolo/
- The MakeFile parameters used are all default except for as follows:
    - GPU=1
    - CUDNN=0
    - OPENCV=1
    - OPENMP=0
    - DEBUG=0
Once completed the desired weights (e.g. "yolov3-tiny.weights") should be moved into the ./model/weights folder and the compiled library "libdarknet.so" should be placed in the ./model folder. 

Alternatly the weights provided in this repository and the compiled "libdarknet.so" can be used if this code is being run on a CUDA enabled GPU. Note this will only work on a Unix machine, as "libdarknet.so" wont run on Windows.

### Running the system
1. Open a terminal and cd into the "SemanticMapLabels" folder.
2. Run: "python classifierDepth.py" \
This will generate a 2D plot representing the environment captured by the stereo camera with annotated labels of the detected objects.   
4. Run: "python classifierWebcam2.py" \
This will access the computers webcam, if available, and perform objection detection while also ????????

## Repo Contents:
- **classifierDepth.py**: Main script needed, allows for both object detection and mapping using the Inteal RealSense D435i stereo camera

- **classifierSingle.py**: Test object detection on a single image, feed it a input image from ./models/data

- **classifierWebcam.py**: Test object detection with a webcam

- **classifierWebcam2.py**: Test object detection with a webcam, uses a structure more similar to that of the main "classifierDepth.py" script

- **models**: Folder to contain everything related to the ML models
    - *weights*: Folder to contain pre-trained weights for YOLOv3 Network
        - yolov3-tiny.weights: Pre-trained wegihts
    - *data*: Folder to contain and labels or datasets to be used
        - dog.jpg: Test image for "classifierSingle.py"
        - coco.names: Contains all the labels from the COCO Dataset
    - *cfg*: Folder to contain all config files for networks used
        - coco.data: Config paramters for COCO Dataset
    - *libdarknet.so*: Pre-compiled Darknet library using YOLOv3 and trained on ????

