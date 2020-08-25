/*  REQUIRED LIBRARIES  */
import io from "socket.io";
import http from "http";
import {
    RobotStatus,
    DrivetrainStatus,
    GamepadStatus,
    SensorStatus
} from "./interfaces";


/*      SETUP SERVER AND SOCKET     */
var httpserver=http.createServer();
httpserver.listen(3000,"192.168.0.25")
const server = io.listen(httpserver); //SocketIO server

let curCmd:DrivetrainStatus; //Object with three axes values
const SPEED_MX = 250; //Speed multiplier

/*      HANDLE SOCKET EVENTS    */
server.on("connect", (socket) => {
    console.log("Client is connected");
    socket.send("Hello from server!");

    //REMOTE CLIENT MESSAGES:
    //Check for msg from remote-client
    socket.on("command", function (data: GamepadStatus) {//TODO: Explicitly list the type
        //console.log(data)
        curCmd = parseMsg(data); //Log and pasrse the recieved message
        socket.broadcast.emit("command", curCmd)
        console.log(curCmd)
    })

    //Check for msg from obc-client
    socket.on("sensorRequest", function () {//TODO: Explicitly list the type
        //console.log("sensorRequest")
        socket.broadcast.emit("sensorRequest")
    });
    
    //Check for msg from obc-client
    socket.on("robotRequest", function () {//TODO: Explicitly list the type
        //console.log("robotRequest")
        socket.broadcast.emit("robotRequest")
    });
        
    //OBC CLIENT MESSAGES:
    //Check for msg from remote-client
    socket.on("sensorResponse", function (data: SensorStatus) {//TODO: Explicitly list the type
        socket.broadcast.emit("sensorResponse",data)
    });

    //Check for msg from obc-client
    socket.on("robotResponse", function (data: RobotStatus) {//TODO: Explicitly list the type
        socket.broadcast.emit("robotResponse",data)
    });
});

/*      SUPPORTING FNC's       */
//Parse incoming message from client
function parseMsg(gamepadCommand: GamepadStatus) : DrivetrainStatus {
    const drivetrainCommand:DrivetrainStatus= {
        ...gamepadCommand,
        axes: {
            x:gamepadCommand.axes.x*SPEED_MX,
            y:gamepadCommand.axes.y*SPEED_MX,
            om:gamepadCommand.axes.om*SPEED_MX
        }
    }

    //console.log(drivetrainCommand);

    return drivetrainCommand;
}
