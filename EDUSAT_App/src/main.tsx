/*  REQUIRED LIBRARIES  */
import { app, BrowserWindow } from "electron";
import * as path from "path";
import SerialPort from "serialport";
import { createStore } from "redux";
import {
  SensorStatus,
  State,
  Action,
  UpdateSensorData,
  UpdateComPort,
} from "./interfaces";

//////////////////////////
/*      APP SETUP       */
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
//////////////////////////
/*      STATE MANAGEMENT        */
//Redux dispatch store setup
const initial_State: State = {
  sensor: {
    volts: { v1: 0, v2: 0, v3: 0, v4: 0, v5: 0, v6: 0 },
    amps: { i1: 0, i2: 0, i3: 0, i4: 0, i5: 0, i6: 0 },
    temps: { t1: 0, t2: 0, t3: 0, t4: 0 },
  },
};
const store = createStore(reducer);

//Subscribe to store to get state updates and send them to the server
const unsubscribe = store.subscribe(() => {}); //When state updates can subscribe the store here

//update sensor data action creator, returns a Action
function UpdateSensorData(sensor: SensorStatus): UpdateSensorData {
  return {
    volts: {
      v1: sensor.volts.v1,
      v2: sensor.volts.v2,
      v3: sensor.volts.v3,
      v4: sensor.volts.v4,
      v5: sensor.volts.v5,
      v6: sensor.volts.v6,
    },
    amps: {
      i1: sensor.amps.i1,
      i2: sensor.amps.i2,
      i3: sensor.amps.i3,
      i4: sensor.amps.i4,
      i5: sensor.amps.i5,
      i6: sensor.amps.i6,
    },
    temps: {
      t1: sensor.temps.t1,
      t2: sensor.temps.t2,
      t3: sensor.temps.t3,
      t4: sensor.temps.t4,
    },
    type: "UpdateSensorData",
  };
}

//update comport with MCU action creator, returns a Action
function UpdateComPort(port: SerialPort): UpdateComPort {
  return {
    port: port,
    type: "UpdateComPort",
  };
}

//Reduce the action that was dispatched
function reducer(state: State = initial_State, action: Action): State {
  if (action.type === "UpdateSensorData") {
    const newState: State = {
      ...state,
      sensor: {
        ...state.sensor,
        volts: action.volts,
        amps: action.amps,
        temps: action.temps,
      },
    };
    return newState;
  } else if (action.type === "UpdateComPort") {
    const newState: State = {
      ...state,
      port: action.port,
    };
    console.log("COMPORT UPDATED");
    console.log(action.port.path);
    return newState;
  }
  return state;
}
//////////////////////////
/*      SETUP SERIAL PORT      */
const HEADER = "H";
const DELIMITER = ",";
const FOOTER = "F";
const MAX_DATA_SIZE = 100;

//TODO: Fix issue where if no com port is detected it wont keep looking for one
///Find the serial port with a Arduino connected:
//Using promises because that is what SerialPort.list() returns
//This ensures that we catch any errors if no ports are returned
//Using SerialPort.list() prevents us from having to hardcode the path
SerialPort.list()
  .then((ports) => {
    ports.forEach((port) => {
        console.log("we have a port")
      if (port.path) {
        var curPort = new SerialPort(port.path, { autoOpen: false });
        store.dispatch(UpdateComPort(curPort));
        console.log(curPort.path);
        return curPort;
      }
    });
    console.log("we have dispatched");
  })
  .then(() => {
    var port: SerialPort | undefined = store.getState().port;
    //console.log("in then2");
    console.log(port);
    return port;
  })
  .then((port) => {
    //console.log(port);
    return makeSerialPort(port ? port.path : "PORT DNE");
  })
  .then((port) => {
    //console.log("in then4");
    return portReading(port);
  })
  .catch((err) => {
    console.log("we have caught a port error", err);
  });

//////////////////////////
/*      SERIAL PORT FUNCTIONS      */
function makeSerialPort(path: string): SerialPort {
  const port = new SerialPort(path, {
    autoOpen: true,
    baudRate: 9600,
  });
  console.log("we made a port");
  return port;
}

function portReading(port: SerialPort): SerialPort {
  //Setup serial parser:
  const Readline = SerialPort.parsers.Readline;
  const parser = port.pipe(new Readline({ delimiter: "\n" }));
  var currentData = "";

  /*      HANDLE SERIAL EVENTS    */
  //Read serial data coming from MCU
  port.on("open", function () {
    console.log("Serial port is open!");

    var dataIndex = 0;

    parser.on("data", function (data: any) {
      let newSensorData: SensorStatus = {
        volts: { v1: 1, v2: 0, v3: 0, v4: 0, v5: 1.21, v6: 0 },
        amps: { i1: 0, i2: 2, i3: 4, i4: 0, i5: 0, i6: 0 },
        temps: { t1: 0, t2: 0, t3: 500, t4: 0 },
      };

      //Check if the received data has a valid format that we can read and then parse it
      if (data[0] === HEADER) {
        //console.log(data)
        for (var i = 1; i < data.length; i++) {
          //console.log(data[i])
          switch (data[i]) {
            case DELIMITER: {
              switch (
                dataIndex //TODO: FIX THIS KEYANNA!!!!!!!!!!!!
              ) {
                case 0:
                  newSensorData.volts.v1 = +currentData;
                  break;
                case 1:
                  newSensorData.volts.v2 = +currentData;
                  break;
                case 2:
                  newSensorData.volts.v3 = +currentData;
                  break;
                case 3:
                  newSensorData.volts.v4 = +currentData;
                  break;
                case 4:
                  newSensorData.volts.v5 = +currentData;
                  break;
                case 5:
                  newSensorData.volts.v6 = +currentData;
                  break;
                //ADD CURRENTS AND TEMP CASES!!!!!!
                default:
                  break;
              }
              dataIndex++;
              currentData = "";
              break;
            }
            case FOOTER: {
              dataIndex = 0;
              console.log(newSensorData);
              store.dispatch(UpdateSensorData(newSensorData));
              return;
            }
            default: {
              currentData += data[i];
              break;
            }
          }
        }
      }
    });
  });
  return port;
}

//TODO: WRTITE COMMANDS TO THE ARDUINO
function setDriveTrainStatus(command: string, port: SerialPort) {
  //If the port is open write data
  if (port.isOpen) {
    port.write("a");
    port.write("\n");
  } else {
    return;
  }
}
//////////////////////////
