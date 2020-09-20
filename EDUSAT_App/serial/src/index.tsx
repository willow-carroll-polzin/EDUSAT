/*  REQUIRED LIBRARIES  */
import io from "socket.io-client";
import SerialPort from "serialport";
import generate from "csv-generate";
import fs from "fs";
import { createStore } from "redux";
import {
    SensorStatus,
    ComPort,
    State,
    Action,
    UpdateSensorData,
    UpdateComPort,
} from "./interfaces";


let file = fs.createWriteStream("test.csv",{flags:"a"});
generate({
    columns:["test","test2"],
    length: 1,
    delimiter:",",

    

}).pipe(file)

/*  SOCKET SETUP  */
const socket = io("http://192.168.0.25:3000/"); //SocketIO client

/*      HANDLE SOCKET EVENTS    */
//Handle connections
function setupSocketEvents(port: SerialPort): SerialPort {
    socket.on("connect", () => {
        console.log("Connected to server!");
        socket.send("Hello from client!");

        socket.on("command", function (data: string) {
            //Process is: RX Command -> serialWrite to MCU -> UpdateDrivetrainData

            sendCommands(data, port);
        });
    });
    //Log reconnect attempts
    socket.on("reconnect", (e: number) => {
        console.log("Reconnected to server!");
        socket.send("Number of reconnects: " + e);
    });
    return port;
}

//Send robot status information
type SEND = () => void; //IO type
//Send sensor information
const sendSensorData = (sensor: SensorStatus, socket: SocketIOClient.Socket): SEND => {
    //Instance of IO type
    console.log("sending sensor data")
    const send = () => socket.emit("sensorData", sensor);
    return send;
};
const sendState = (port: String|undefined, socket: SocketIOClient.Socket): SEND => {
    console.log("sending port")
    const send =() => socket.emit("stateData", port)
    return send;
}

/*    APP EVENT HANDLERS    */
//Redux dispatch store setup
//var serialPort = new SerialPort("NO CONNECTION");

//somehow this initial state is getting pushed to the serial port
const initial_State: State = {
    sensor: {
        voltage: [0, 0, 0, 0, 0, 0],
        current: [0, 0, 0, 0, 0, 0],
        temperature: [1, 1, 1, 1],
    },
};
const store = createStore(reducer);

//Subscribe to store to get state updates and send them to the server -> THIS IS NOT RUNNING IN DEMO BECAUSE THE STATE NEVER CHANGES
const unsubscribe = store.subscribe(() => {
    const x = sendSensorData(store.getState().sensor, socket);
    x();
    var ourPort = store.getState().port;
    if (ourPort !== undefined){
        var path = ourPort.path;
    }else{
        var path = "empty"
    }
    const y = sendState(path,socket);
    y();
}); //When state updates can subscribe the store here

//update sensor data action creator, returns a Action
function UpdateSensorData(sensor: SensorStatus): UpdateSensorData {
    return {
        voltage: sensor.voltage,
        current: sensor.current,
        temperature: sensor.temperature,
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
                voltage: action.voltage,
                current: action.current,
                temperature: action.temperature,
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
    } else return state;
}

/*      SETUP SERIAL PORT      */
const HEADER = "H";
const VHEADER ="V";
const THEADER="T";
const IHEADER="I";
const DELIMITER = ",";
const FOOTER = "F";
const MAX_DATA_SIZE = 100;

///Find the serial port with a Arduino connected:
//Using promises because that is what SerialPort.list() returns
//This ensures that we catch any errors if no ports are returned
//Using SerialPort.list() prevents us from having to hardcode the path
SerialPort.list()
    .then((ports) => {
        ports.forEach((port) => {
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
        //console.log(port)
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
    .then((port) => {
        setupSocketEvents(port);
        return port;
    }).
    then((port)=>{
        sendState(port.path,socket);
        return port;
    })
    .catch((err) => {
        console.log("we have caught a port error", err);
    });

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

        //variable to show which type of data we are collecting (V,I,T)
        var dataType = -1;
        //variable to store our index in the array of data we are currently using
        var dataIndex = 0;


        parser.on("data", function (data: any) {
            console.log("received data")
            let newSensorData: SensorStatus = {
                voltage: [0, 0, 0, 0, 0, 0],
                current: [0, 0, 0, 0, 0, 0],
                temperature: [1, 1, 1, 1],
            };

            //Check if the received data has a valid format that we can read and then parse it
            if (data[0] === HEADER) {
                //Cycle through valid data and assign it to the correct state variable
                for (var i = 1; i < data.length; i++) {
                    switch (data[i]) {
                        case ('\n'):{
                            //ignore newlines
                            break;
                        }
                        //If we have received the header of a subsection, set our current data type to that
                        case VHEADER:{
                            dataType=0;
                            dataIndex = 0;
                            break;
                        }
                        case IHEADER:{
                            dataType=1;
                            dataIndex = 0;
                            break;
                        }
                        case THEADER:{
                            dataType=2;
                            dataIndex = 0;
                            break;
                        }
                        case DELIMITER: {
                            switch (dataType) {
                                case 0:
                                    newSensorData.voltage[dataIndex] = +currentData;
                                    break;
                                case 1:
                                    newSensorData.current[dataIndex] = +currentData;
                                    break;
                                case 2:
                                    newSensorData.temperature[dataIndex] = +currentData;
                                    break;
                                default:
                                    break;
                            }
                            dataIndex++;
                            currentData = "";
                            break;
                        }
                        case FOOTER: {
                            dataIndex = 0;
                            console.log("DATA IS")
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

//TODO:
//Send serial data over serial interface to MCU
function sendCommands(command: string, port: SerialPort) {
    //If the port is open write data
    if (port.isOpen) {
        8;
        port.write("c" + command);
        port.write("\n");
    } else {
        return;
    }
}
