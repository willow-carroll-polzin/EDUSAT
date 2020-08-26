/*  REQUIRED LIBRARIES  */
import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { State, SensorStatus, UpdateSensorData, Action } from "./interfaces";
import { SensorsConnected, RSidebarConnected, LSidebarConnected, ChartConnected } from "./App";
import { devToolsEnhancer, composeWithDevTools } from "redux-devtools-extension";

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
        <div>LEFT SIDEBAR RENDER</div>
    </Provider>,
    lSideBarElement
);

const chartElement = document.getElementById("myChart");
ReactDOM.render(
    <Provider store={store}>
        <ChartConnected />
        <div>CHART ELEMENT RENDER</div>
    </Provider>,
    chartElement
)

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
        store.dispatch(UpdateSensorData(data));
    });
});

//Log reconnect attempts
socket.on("reconnect", (e: number) => {
    console.log("Reconnected to server!");
    socket.send("Number of reconnects: " + e);
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
        const newState: State = {
            ...state,
            sensors: {
                ...state.sensors,
                voltage: state.sensors.voltage,
                current: state.sensors.current,
                temperature: state.sensors.temperature,
            },
        };
        return newState;
    }
    return state;
}
export default reducer;
