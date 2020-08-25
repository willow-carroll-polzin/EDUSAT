/*  REQUIRED LIBRARIES  */
import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {
    State,
    SensorStatus,
    UpdateSensorData,
    Action,
} from "./interfaces";
import {SensorsConnected,RSidebarConnected,LSidebarConnected} from "./App";
import { devToolsEnhancer, composeWithDevTools } from "redux-devtools-extension";

/*  REDUX SETUP  */
//Initial state of redux store
const initial_State: State = {
    sensors: {
        selection: { heartRate: false, temperature: false },
        values: { heartRate: 0, temperature: 0 },
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
    socket.on("sensorResponse", function (data: SensorStatus) {
        //TODO: Explicitly list the type
        console.log("webpage has received sensor response")
        console.log(data); //DO SOMETHING WITH THE DATA!
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
        selection: {
            //fix how the sensor selection is retrieved
            heartRate: sensors.selection.heartRate,
            temperature: sensors.selection.temperature,
        },
        values: {
            heartRate: sensors.values.heartRate,
            temperature: sensors.values.temperature,
        },
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
                values: {
                    heartRate: action.selection.heartRate ? action.values.heartRate : state.sensors.values.heartRate,
                    temperature: action.selection.temperature ? action.values.temperature : state.sensors.values.temperature,
                },
            },
        };
        return newState;
    }
    return state;
}
export default reducer;