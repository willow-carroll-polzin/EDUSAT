/*  REQUIRED LIBRARIES  */
import React from "react";
import { connect } from "react-redux";
import { State } from "./interfaces";
import Chart from "chart.js";

/*  REACT-REDUX CONNECTION FUNCTIONS  */
const mapStateToProps = (state: State) => ({
    sensors: state.sensors,
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
const Sensors = (state: State) => (
    <React.Fragment>
        <div>Voltage: {state.sensors.voltage} V </div>
        <div>Current: {state.sensors.current} A </div>
        <div>Temperature: {state.sensors.temperature} C </div>
    </React.Fragment>
);

const RSidebar = (state: State) => (
    <React.Fragment>
        <div>FILE MANAGER</div>
    </React.Fragment>
);

const LSidebar = (state: State) => (
    <React.Fragment>
        <div>SYSTEM STATUS</div>
        <script></script>
    </React.Fragment>
);
const ChartBox = (state: State) => (
    <React.Fragment>

    </React.Fragment>
);



//Export new functions that connect our html returning functions to our store
export const SensorsConnected = connector(Sensors);
export const RSidebarConnected = connector(RSidebar);
export const LSidebarConnected = connector(LSidebar);
export const ChartConnected = connector(ChartBox);
