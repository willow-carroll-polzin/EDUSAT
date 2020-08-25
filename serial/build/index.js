"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*  REQUIRED LIBRARIES  */
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const serialport_1 = __importDefault(require("serialport"));
const redux_1 = require("redux");
/*  SOCKET SETUP  */
const socket = socket_io_client_1.default("http://192.168.0.25:3000/"); //SocketIO client
/*      HANDLE SOCKET EVENTS    */
//Handle connections
function setupSocketEvents(port) {
    socket.on("connect", () => {
        console.log("Connected to server!");
        socket.send("Hello from client!");
        socket.on("command", function (data) {
            //Process is: RX Command -> serialWrite to MCU -> UpdateDrivetrainData
            setDriveTrainStatus(data, port);
            store.dispatch(UpdateDrivetrainData(data));
        });
        socket.on("sensorRequest", function () {
            //Process is: RX req -> Query MCU -> Record MCU -> UpdateSensorData -> emit update
            const x = sendSensorData(store.getState().sensor, socket);
            x();
        });
        socket.on("robotRequest", function () {
            //Process is: RX req -> Query MCU -> Record MCU -> UpdateRobotData -> emit update
            const y = sendRobotData(store.getState().robot, socket);
            y();
        });
    });
    //Log reconnect attempts
    socket.on("reconnect", (e) => {
        console.log("Reconnected to server!");
        socket.send("Number of reconnects: " + e);
    });
    return port;
}
const sendRobotData = (status, socket) => {
    //Instance of IO type
    const send = () => socket.emit("robotResponse", status);
    return send;
};
//Send sensor information
const sendSensorData = (sensor, socket) => {
    //Instance of IO type
    const send = () => socket.emit("sensorResponse", sensor);
    return send;
};
/*    APP EVENT HANDLERS    */
//Redux dispatch store setup
//var serialPort = new SerialPort("NO CONNECTION");
const initial_State = {
    robot: { connected: false, voltage: 0 },
    drive: {
        axes: { x: 0, y: 0, om: 0 },
        toggle: { start: 0, stop: 0 },
    },
    sensor: {
        selection: { heartRate: false, temperature: false },
        values: { heartRate: 0, temperature: 0 },
    },
};
const store = redux_1.createStore(reducer);
//Subscribe to store to get state updates and send them to the server
const unsubscribe = store.subscribe(() => {
    const x = sendSensorData(store.getState().sensor, socket);
    x();
}); //When state updates can subscribe the store here
setInterval(sendSensorData(store.getState().sensor, socket), 1000 / 30);
//update game data action creator, returns a Action
function UpdateDrivetrainData(drive) {
    return {
        axes: { x: drive.axes.x, y: drive.axes.y, om: drive.axes.om },
        toggle: {
            start: drive.toggle.start,
            stop: drive.toggle.stop,
        },
        type: "UpdateDrivetrainData",
    };
}
//update sensor data action creator, returns a Action
function UpdateSensorData(sensor) {
    return {
        selection: {
            heartRate: sensor.selection.heartRate,
            temperature: sensor.selection.temperature,
        },
        values: { heartRate: sensor.values.heartRate, temperature: sensor.values.temperature },
        type: "UpdateSensorData",
    };
}
//update robot data action creator, returns a Action
function UpdateRobotData(robot) {
    return {
        connected: robot.connected,
        voltage: robot.voltage,
        type: "UpdateRobotData",
    };
}
//update comport with MCU action creator, returns a Action
function UpdateComPort(port) {
    return {
        port: port,
        type: "UpdateComPort",
    };
}
//Reduce the action that was dispatched
function reducer(state = initial_State, action) {
    if (action.type === "UpdateSensorData") {
        const newState = {
            ...state,
            sensor: {
                ...state.sensor,
                selection: action.selection,
                values: { ...action.values,
                    temperature: Math.random() * 5 },
            },
        };
        return newState;
    }
    else if (action.type === "UpdateRobotData") {
        const newState = {
            ...state,
            robot: {
                ...state.robot,
                connected: action.connected,
                voltage: action.voltage,
            },
        };
        return newState;
    }
    else if (action.type === "UpdateDrivetrainData") {
        const newState = {
            ...state,
            drive: {
                ...state.drive,
                axes: action.axes,
                toggle: action.toggle,
            },
        };
        return newState;
    }
    else if (action.type === "UpdateComPort") {
        const newState = {
            ...state,
            port: action.port,
        };
        console.log("COMPORT UPDATED");
        console.log(action.port.path);
        return newState;
    }
    else
        return state;
}
/*      SETUP SERIAL PORT      */
const HEADER = "H";
const DELIMITER = ",";
const FOOTER = "F";
const MAX_DATA_SIZE = 100;
///Find the serial port with a Arduino connected:
//Using promises because that is what SerialPort.list() returns
//This ensures that we catch any errors if no ports are returned
//Using SerialPort.list() prevents us from having to hardcode the path
serialport_1.default.list()
    .then((ports) => {
    ports.forEach((port) => {
        if (port.path) {
            var curPort = new serialport_1.default(port.path, { autoOpen: false });
            store.dispatch(UpdateComPort(curPort));
            console.log(curPort.path);
            return curPort;
        }
    });
    console.log("we have dispatched");
})
    .then(() => {
    var port = store.getState().port;
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
    console.log("in then5");
    return port;
})
    .catch((err) => {
    console.log("we have caught a port error", err);
});
/*      SERIAL PORT FUNCTIONS      */
function makeSerialPort(path) {
    const port = new serialport_1.default(path, {
        autoOpen: true,
        baudRate: 9600,
    });
    console.log("we made a port");
    return port;
}
function portReading(port) {
    //Setup serial parser:
    const Readline = serialport_1.default.parsers.Readline;
    const parser = port.pipe(new Readline({ delimiter: "\n" }));
    var currentData = "";
    /*      HANDLE SERIAL EVENTS    */
    //Read serial data coming from MCU
    port.on("open", function () {
        console.log("Serial port is open!");
        var dataIndex = 0;
        parser.on("data", function (data) {
            let newSensorData = {
                selection: { heartRate: false, temperature: true },
                values: { heartRate: 0, temperature: 0 },
            };
            let newRobotData = {
                connected: true,
                voltage: 10,
            };
            //Check if the received data has a valid format that we can read and then parse it
            if (data[0] === HEADER) {
                //console.log(data)
                for (var i = 1; i < data.length; i++) {
                    //console.log(data[i])
                    switch (data[i]) {
                        case DELIMITER: {
                            switch (dataIndex) {
                                case 0:
                                    newSensorData.values.heartRate = +currentData;
                                    break;
                                case 1:
                                    newSensorData.values.temperature = +currentData;
                                    break;
                                case 2:
                                    newRobotData.voltage = +currentData;
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
                            console.log(newSensorData);
                            console.log(newRobotData);
                            store.dispatch(UpdateSensorData(newSensorData));
                            store.dispatch(UpdateRobotData(newRobotData));
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
//Send serial data over serial interface to MCU
function setDriveTrainStatus(command, port) {
    //If the port is open write data
    if (port.isOpen) {
        8;
        port.write("a" + command.axes.x);
        port.write("b" + command.axes.y);
        port.write("c" + command.axes.om);
        port.write("s" + command.toggle.start);
        port.write("e" + command.toggle.stop);
        port.write("\n");
    }
    else {
        return;
    }
}
