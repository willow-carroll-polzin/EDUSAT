/*  REQUIRED LIBRARIES  */
import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { State, SensorStatus, UpdateSensorData, UpdateComPortData, Action } from "./interfaces";
import { SensorsConnected, RSidebarConnected, LSidebarConnected, ChartConnected, DownloaderConnected } from "./App";
import { devToolsEnhancer, composeWithDevTools } from "redux-devtools-extension";
import Chart from "chart.js";


/*TIME DATA SETUP*/
var today = new Date();
var counter = 0;
const MAX_DATA_SET_LENGTH = 10;
/*  REDUX SETUP  */
//Initial state of redux store
const initial_State: State = {
    sensors: {
        voltage: [1, 2, 3, 4, 5, 6],
        current: [0, 0, 0, 0, 0, 0],
        temperature: [0, 0, 0, 0],
    },
    port: "",
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

const downloadElement = document.getElementById("downloader")

ReactDOM.render(
    <Provider store={store}>
        < DownloaderConnected />
    </Provider>,
    downloadElement
);

const lSideBarElement = document.getElementById("lSidebar");

ReactDOM.render(
    //Provide the 'SensorsConnected' React component with access to the store
    <Provider store={store}>
        <LSidebarConnected />
    </Provider>,
    lSideBarElement
);

//update addData function to take a specific dataset to add the data to
function addData(chart: Chart, label: string, data: number, dataset: number) {
    console.log("adding data that is: " + data);
    if (chart.data.datasets) {
        if (dataset === 0) {
            if (chart.data.datasets[0].data !== undefined && chart.data.datasets[0].data.length > MAX_DATA_SET_LENGTH) {
                //console.log("shifting label");
                chart.data.labels?.shift();
                chart.data.datasets[dataset]?.data?.shift();
            }
        } else {
            if (chart.data.datasets[0].data !== undefined && chart.data.datasets[0].data.length > MAX_DATA_SET_LENGTH) {
                console.log(chart.data.datasets[dataset]?.data ? "YES SHIFT DATA" : "NO SHIFT DATA");
                chart.data.datasets[dataset]?.data?.shift();
                //chart.data.labels?.shift();
            }
        }

        if (chart.data.labels && dataset === 0) {
            console.log("pushing label");
            chart.data.labels.push(label);
        }

        console.log("pushing data");
        chart.data.datasets[dataset]?.data?.push(data);
    }
    chart.update({ duration: 0 });
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
const socket = io("http://localhost:3000/"); //Port for client

/*   SOCKET FUNCTIONS  */
//Log connections
//Handle connections
socket.on("connect", () => {
    console.log("OBC SAYS: Connected to server!");
    socket.send("Hello from client!");

    //Check for current data from sensors
    //Note that this OBC client only listens for sensor data,
    //it does not actively request it like the remote client
    socket.on("stateData", function (data: String) {
        store.dispatch(UpdateComPortData(data));
    });
    socket.on("sensorData", function (data: SensorStatus) {
        console.log("webpage has received sensor data");
        console.log(data);
        data.current = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
        data.voltage = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
        today = new Date();
        store.dispatch(UpdateSensorData(data));
        for (var i: number = 0; i < 6; i++) {
            counter++;
            addData(
                voltageChart,
                today.getHours().toString().padStart(2, "0") +
                    ":" +
                    today.getMinutes().toString().padStart(2, "0") +
                    ":" +
                    today.getSeconds().toString().padStart(2, "0"),
                //i*(counter),
                data.voltage[i],
                i
            );
        }
        for (var i: number = 0; i < 6; i++) {
            addData(
                currentChart,
                today.getHours().toString().padStart(2, "0") +
                    ":" +
                    today.getMinutes().toString().padStart(2, "0") +
                    ":" +
                    today.getSeconds().toString().padStart(2, "0"),
                //i*Math.random(),
                data.current[i],
                i
            );
        }
        for (var i: number = 0; i < 4; i++) {
            addData(
                tempChart,
                today.getHours().toString().padStart(2, "0") +
                    ":" +
                    today.getMinutes().toString().padStart(2, "0") +
                    ":" +
                    today.getSeconds().toString().padStart(2, "0"),
                data.temperature[i],
                i
            );
        }
    });
});

//Log reconnect attempts
socket.on("reconnect", (e: number) => {
    console.log("Reconnected to server!");
    socket.send("Number of reconnects: " + e);
});

/*       DATA DISPLAY      */
//Create voltage graph
export var voltageChart = new Chart("voltageChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Temperature #1",
                borderColor: "red",
                data: [],
                fill: false,
                hidden: false,
            },
            {
                label: "Temperature #2",
                borderColor: "orange",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Temperature #3",
                borderColor: "green",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Temperature #4",
                borderColor: "blue",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Temperature #5",
                borderColor: "purple",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Temperature #6",
                borderColor: "black",
                data: [],
                fill: false,
                hidden: true,
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
export var currentChart = new Chart("currentChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Current #1",
                borderColor: "red",
                data: [],
                fill: false,
                hidden: false,
            },
            {
                label: "Current #2",
                borderColor: "orange",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Current #3",
                borderColor: "green",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Current #4",
                borderColor: "blue",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Current #5",
                borderColor: "purple",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Current #6",
                borderColor: "black",
                data: [],
                fill: false,
                hidden: true,
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

//Create temperature graph
export var tempChart = new Chart("tempChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Temperature #1",
                borderColor: "red",
                data: [],
                fill: false,
                hidden: false,
            },
            {
                label: "Temperature #2",
                borderColor: "blue",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Temperature #3",
                borderColor: "green",
                data: [],
                fill: false,
                hidden: true,
            },
            {
                label: "Temperature #4",
                borderColor: "orange",
                data: [],
                fill: false,
                hidden: true,
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

function UpdateComPortData(port: String): UpdateComPortData {
    return {
        port: port,
        type: "UpdateComPortData",
    };
}
//Reduce the action that was dispatched
function reducer(state: State = initial_State, action: Action): State {
    if (action.type === "UpdateSensorData") {
        console.log("in rxr");
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
    } else if (action.type === "UpdateComPortData") {
        const newState: State = {
            ...state,
            port: action.port,
        };
        return newState;
    } else {
        return state;
    }
}
export default reducer;
