/*  REQUIRED LIBRARIES  */
import io from "socket.io";
import http from "http";
import { SensorStatus } from "./interfaces";
import fs from "fs";
import path from "path";
import csv from "fast-csv";

/*      SETUP SERVER AND SOCKET     */
var httpserver = http.createServer();
httpserver.listen(3000, "192.168.0.45");
const server = io.listen(httpserver); //SocketIO server

let curCmd: string; //Command to send to system
let curData: SensorStatus; //Current sensor data

/*      HANDLE SOCKET EVENTS    */
server.on("connect", (socket) => {
    console.log("Client is connected");
    socket.send("Hello from server!");

    //WEBPAGE CLIENT MESSAGES:
    //Check for msg from remote-client
    socket.on("command", function (data: string) {
        socket.broadcast.emit("command", data);
        console.log(curCmd);
    });

    //SERIAL CLIENT MESSAGES:
    //Check for msg from remote-client
    socket.on("sensorData", function (data: SensorStatus) {
        //TODO: Explicitly list the type
        curData = data;
        writeData(curData, getFileName());
        socket.broadcast.emit("sensorData", data);
    });
});

/*      WRITE DATA TO CSV       */
let sensors: SensorStatus = {
    voltage: [1, 2, 3, 4, 5, 6],
    current: [0, 1, 0, 10, 0, 0],
    temperature: [5, 0, 3, 0],
};
curData = sensors;
writeData(curData, getFileName());

function getFileName() {
    let filepath = Date.now().toString() + "_EDUSAT_Telemetry";
    return filepath
}

function writeData(data: SensorStatus, filepath: string) {
    //Get current data
    let ts = Date.now();
    let date_ob = new Date(ts);
    let day = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    //Write current data in a row format
    let row: string[] = new Array(16);
    console.log(data.temperature[0].toString());
    for (let i = 0; i < 17; i++) {
        if (i == 0) {
            row[i] = day.toString()+month.toString()+year.toString();
        } else if (i < 7) {
            console.log("V" + i);
            row[i] = data.voltage[i - 1].toString();
        } else if (i < 13) {
            console.log("C" + i);
            row[i] = data.current[i - 7].toString();
        } else {
            console.log("T" + i);
            row[i] = data.temperature[i - 13].toString();
        }
    }
    let rows: string[][] = [row];

    //Write current data to the csv on the given path
    csv.writeToPath(path.resolve("src", filepath), rows)
        .on("error", (err) => console.error(err))
        .on("finish", () => console.log("Done writing."));
}
