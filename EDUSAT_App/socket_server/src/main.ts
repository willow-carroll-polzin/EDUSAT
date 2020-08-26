/*  REQUIRED LIBRARIES  */
import io from "socket.io";
import http from "http";
import {
    SensorStatus
} from "./interfaces";


/*      SETUP SERVER AND SOCKET     */
var httpserver=http.createServer();
httpserver.listen(3000,"192.168.0.25")
const server = io.listen(httpserver); //SocketIO server

let curCmd:string; //Command to send to system
const SPEED_MX = 250; //Speed multiplier

/*      HANDLE SOCKET EVENTS    */
server.on("connect", (socket) => {
    console.log("Client is connected");
    socket.send("Hello from server!");

    //REMOTE CLIENT MESSAGES:
    //Check for msg from remote-client
    socket.on("command", function (data: string) {
        socket.broadcast.emit("command", data)
        console.log(curCmd)
    })

    //Check for msg from obc-client
    socket.on("sensorRequest", function () {
        //console.log("sensorRequest")
        socket.broadcast.emit("sensorRequest")
    });
        
    //OBC CLIENT MESSAGES:
    //Check for msg from remote-client
    socket.on("sensorResponse", function (data: SensorStatus) {//TODO: Explicitly list the type
        socket.broadcast.emit("sensorResponse",data)
    });
});
