/*  REQUIRED LIBRARIES  */
import React from "react";
import { connect } from "react-redux";
import { State } from "./interfaces";
import Chart from "chart.js";
import { voltageChart, currentChart, tempChart } from "./index";
import CsvDownloader from "react-csv-downloader";

/*  REACT-REDUX CONNECTION FUNCTIONS  */
const mapStateToProps = (state: State) => ({
    sensors: state.sensors,
    port: state.port,
});

const dispatchProps = {
    addGamepad: () => {
        type: "AddGamePad";
    },
};

/*  REACT FUNCTIONS FOR APP  */
//Function to connect our react components to our store
const connector = connect(mapStateToProps, dispatchProps);

//Function to return html code based on the state of the store relating to the sensors
const LSidebar = (state: State) => (
    <React.Fragment>
        <div>SYSTEM STATUS</div>
        <script></script>
        <div>Current Values</div>
        <div>Voltage 1: {state.sensors.voltage[0].toPrecision(3)} V </div>
        <div>Voltage 2: {state.sensors.voltage[1].toPrecision(3)} V </div>
        <div>Voltage 3: {state.sensors.voltage[2].toPrecision(3)} V </div>
        <div>Voltage 4: {state.sensors.voltage[3].toPrecision(3)} V </div>
        <div>Voltage 5: {state.sensors.voltage[4].toPrecision(3)} V </div>
        <div>Voltage 6: {state.sensors.voltage[5].toPrecision(3)} V </div>
        <br></br>
        <div>Current 1: {state.sensors.current[0].toPrecision(3)} A </div>
        <div>Current 2: {state.sensors.current[1].toPrecision(3)} A </div>
        <div>Current 3: {state.sensors.current[2].toPrecision(3)} A </div>
        <div>Current 4: {state.sensors.current[3].toPrecision(3)} A </div>
        <div>Current 5: {state.sensors.current[4].toPrecision(3)} A </div>
        <div>Current 6: {state.sensors.current[5].toPrecision(3)} A </div>
        <br></br>
        <div>Temperature 1: {state.sensors.temperature[0]} C </div>
        <div>Temperature 2: {state.sensors.temperature[1]} C </div>
        <div>Temperature 3: {state.sensors.temperature[2]} C </div>
        <div>Temperature 4: {state.sensors.temperature[3]} C </div>
    </React.Fragment>
);

//TODO: Danlging, MUST delete
const Sensors = (state: State) => <React.Fragment></React.Fragment>;

//Function to return html code based on the state of the store relating to the file manager
const RSidebar = (state: State) => (
    <React.Fragment>
        <div>FILE MANAGER</div>
        <p>
            The system has detected an arduino on {state.port}, and has connected to it.
            <br></br>
            If this is not the serial port you would like to connect to, please specify an alternate port below:
        </p>
    </React.Fragment>
);

//Function to return html code based on the state of the store relating to the graphs
const ChartBox = (state: State) => <React.Fragment></React.Fragment>;

/*      WRITE DATA TO CSV       */
//Get the csv file name
//Get csv file name
const getTimeStamp = () =>{
    let ts = Date.now();
    let date_ob = new Date(ts);
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let day = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let timestamp =
        month.toString() +
        "_" +
        day.toString() +
        "_" +
        year.toString() +
        "_" +
        hours.toString() +
        "-" +
        minutes.toString() +
        "-" +
        seconds.toString();
        return timestamp;
}

const getFileName = () => {
    let filepath =getTimeStamp() +
        "_EDUSAT_Telemetry.csv";
    return filepath;
};

//Get the csv headers
const columns = [
    {
        id: "first",
        displayName: "First column",
    },
    {
        id: "second",
        displayName: "Second column",
    },
];

const makeCols = () => {
    let testCols: { id: string; displayName: string }[] = [{ id: "0", displayName: "Timestamp" }];
    if (voltageChart !== undefined) {
        for (let i = 0; i < 6; i++) {
            let headerVar: string | undefined = voltageChart.data.datasets?.[i].label;
            if (headerVar !== undefined) {
                testCols.push({ id: i +1+ "", displayName: headerVar });
            }
        }
    }
    if (currentChart !== undefined) {
        for (let i = 0; i < 6; i++) {
            let headerVar: string | undefined = currentChart.data.datasets?.[i].label;
            if (headerVar !== undefined) {
                testCols.push({ id: i + 7 + "", displayName: headerVar });
            }
        }
    }
    if (tempChart !== undefined) {
        for (let i = 0; i < 4; i++) {
            let headerVar: string | undefined = tempChart.data.datasets?.[i].label;
            if (headerVar !== undefined) {
                testCols.push({ id: i + 13 + "", displayName: headerVar });
            }
        }
    }
    console.log(testCols)
    return testCols;
};
var datas = { time: Date.now(), v1: 0, v2: 0, v3: 0, v4: 0, v5: 0, v6: 0, c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, t1: 0, t2: 0, t3: 0, t4: 0 };
var datas2 = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
var testData = [datas2];


const makeData = () => {
    if (voltageChart !== undefined && currentChart !== undefined && tempChart !== undefined) {
        datas2[0] = getTimeStamp();
        let value: string | undefined = "";
        let length = voltageChart.data.datasets?.[0].data?.length;
        if (length !== undefined) {
            for (let i = 0; i < length; i++) {
                for (let j = 1; j <= 17; j++) {
                    if (j <= 7) {
                        value = voltageChart.data.datasets?.[j]?.data?.[i]?.toString();
                    } else if (j <= 13) {
                        value = currentChart.data.datasets?.[j - 7]?.data?.[i]?.toString();
                    } else {
                        value = tempChart.data.datasets?.[j - 13]?.data?.[i]?.toString();
                    }
                    if (value !== undefined) {
                        datas2[j] = value;
                    }
                }
                testData.push(datas2);
            }
        }
    }

    return testData;
};

//Get the csv data
// const datas = [
//     {
//         first: "foo",
//         second: "bar",
//     },
//     {
//         first: "foobar",
//         second: "foobar",
//     },
// ];

//Function to return html code to download the csv
const Download = (state: State) => (
    <React.Fragment>
        <CsvDownloader filename={getFileName()} separator="," wrapColumnChar="" columns={makeCols()} datas={makeData()} text="DOWNLOAD" />
    </React.Fragment>
);

/*      CONNECT HTML FRAGMENTS TO STORE       */
//Export new functions that connect our html returning functions to our store
export const SensorsConnected = connector(Sensors);
export const RSidebarConnected = connector(RSidebar);
export const LSidebarConnected = connector(LSidebar);
export const ChartConnected = connector(ChartBox);
export const DownloaderConnected = connector(Download);
