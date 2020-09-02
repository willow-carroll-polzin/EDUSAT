/*  REQUIRED LIBRARIES  */
import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { State, SensorStatus, UpdateSensorData, Action } from "./interfaces";
import { SensorsConnected, RSidebarConnected, LSidebarConnected, ChartConnected } from "./App";
import { devToolsEnhancer, composeWithDevTools } from "redux-devtools-extension";
import Chart from "chart.js";

/*TIME DATA SETUP*/
var today = new Date();
const MAX_DATA_SET_LENGTH = 50;
/*  REDUX SETUP  */
//Initial state of redux store
const initial_State: State = {
    sensors: {
        voltage: [1, 2, 3, 4, 5, 6],
        current: [0, 0, 0, 0, 0, 0],
        temperature: [0, 0, 0, 0],
    },
};

//Create redux store
const store = createStore(reducer, composeWithDevTools());

/*  REACT SETUP  */
//Find the part of the document labelled "sensorStatus"
const sensorElement = document.getElementById("sensorStatus");
//Render our react components labelled 'SensorsConnected' within this part of the document
ReactDOM.render(
    //Provide the 'SensorsConnected' React component with access to the store
    <Provider store={store}>
        <SensorsConnected />
    </Provider>,
    sensorElement
);

const rSideBarElement = document.getElementById("rSidebar");

ReactDOM.render(
    //Provide the 'SensorsConnected' React component with access to the store
    <Provider store={store}>
        <RSidebarConnected />
    </Provider>,
    rSideBarElement
);

const lSideBarElement = document.getElementById("lSidebar");

ReactDOM.render(
    //Provide the 'SensorsConnected' React component with access to the store
    <Provider store={store}>
        <LSidebarConnected />
    </Provider>,
    lSideBarElement
);

function addData(chart: Chart, label: string, data: number) {
    if (chart.data.labels) {
        chart.data.labels.push(label);
    }
    if (chart.data.datasets) {

        chart.data.datasets.forEach((dataset) => {
            if (dataset.data) dataset.data.push(data);
        });
        if (chart.data.datasets[0].data !== undefined && chart.data.datasets[0].data.length > MAX_DATA_SET_LENGTH) {
            chart.data.datasets[0].data.shift();
            chart.data.labels?.shift();
        }

    }
    chart.update({duration:0});
}
function removeData(chart: Chart) {
    if (chart.data.labels) chart.data.labels.pop();
    if (chart.data.datasets)
        chart.data.datasets.forEach((dataset) => {
            if (dataset.data) dataset.data.pop();
        });
    chart.update();
}
const chartElement = document.getElementById("voltageChart");
ReactDOM.render(
    <Provider store={store}>
        <ChartConnected />
        <div>CHART ELEMENT RENDER</div>
    </Provider>,
    chartElement
);

/*  SOCKET SETUP  */
const socket = io("http://192.168.0.25:3000/"); //Port for client

/*   SOCKET FUNCTIONS  */
//Log connections
//Handle connections
socket.on("connect", () => {
    console.log("OBC SAYS: Connected to server!");
    socket.send("Hello from client!");

    //Check for current data from sensors
    //Note that this OBC client only listens for sensor data,
    //it does not actively request it like the remote client
    socket.on("sensorData", function (data: SensorStatus) {
        console.log("webpage has received sensor data");
        console.log(data);
        today = new Date();
        store.dispatch(UpdateSensorData(data))
        addData(
            voltageChart,
            today.getHours().toString().padStart(2, "0") +
                ":" +
                today.getMinutes().toString().padStart(2, "0") +
                ":" +
                today.getSeconds().toString().padStart(2, "0"),
            data.voltage[2]
        );
        addData(
            currentChart,
            today.getHours().toString().padStart(2, "0") +
                ":" +
                today.getMinutes().toString().padStart(2, "0") +
                ":" +
                today.getSeconds().toString().padStart(2, "0"),
            data.current[2]
        );
        addData(
            tempChart,
            today.getHours().toString().padStart(2, "0") +
                ":" +
                today.getMinutes().toString().padStart(2, "0") +
                ":" +
                today.getSeconds().toString().padStart(2, "0"),
            data.temperature[2]
        );
        store.dispatch(UpdateSensorData(data));
    });
});

//Log reconnect attempts
socket.on("reconnect", (e: number) => {
    console.log("Reconnected to server!");
    socket.send("Number of reconnects: " + e);
});

/*       DATA DISPLAY      */
//Create voltage graph
var voltageChart = new Chart("voltageChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label:"Temperature #1",
                borderColor:"red",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #2",
                borderColor:"orange",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #3",
                borderColor:"green",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #4",
                borderColor:"blue",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #5",
                borderColor:"purple",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #6",
                borderColor:"black",
                data: [],
                fill: false,
            },
        ],
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    },
});

//Create current graph
var currentChart = new Chart("currentChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Current #1",
                borderColor:"red",
                data: [],
                fill: false,
            },
            {
                label: "Current #2",
                borderColor:"orange",
                data:[],
                fill: false,
            },
            {
                label: "Current #3",
                borderColor:"green",
                data:[],
                fill: false,
            },
            {
                label: "Current #4",
                borderColor:"blue",
                data:[],
                fill: false,
            },
            {
                label: "Current #5",
                borderColor:"purple",
                data:[],
                fill: false,
            },
            {
                label: "Current #6",
                borderColor:"black",
                data:[],
                fill: false,
            },
        ],
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    },
});

//Create voltage graph
var tempChart = new Chart("tempChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label:"Temperature #1",
                borderColor:"red",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #2",
                borderColor:"blue",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #3",
                borderColor:"green",
                data: [],
                fill: false,
            },
            {
                label:"Temperature #4",
                borderColor:"orange",
                data: [],
                fill: false,
            },
        ],
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    },
});

/*       APP EVENT HANDLERS      */
//updatesensordata action creator, returns a Action
function UpdateSensorData(sensors: SensorStatus): UpdateSensorData {
    return {
        voltage: sensors.voltage,
        current: sensors.current,
        temperature: sensors.temperature,
        type: "UpdateSensorData",
    };
}
//Reduce the action that was dispatched
function reducer(state: State = initial_State, action: Action): State {
    if (action.type === "UpdateSensorData") {
        console.log("in rxr")
        const newState: State = {
            ...state,
            sensors: {
                ...state.sensors,
                voltage: action.voltage,
                current: action.current,
                temperature: action.temperature,
            },
        };

        return newState;
    }
    return state;
}
export default reducer;
