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
        <div>Current Values</div>
        <div>Voltage 1: {state.sensors.voltage[0]} V </div>
        <div>Voltage 2: {state.sensors.voltage[1]} V </div>
        <div>Voltage 3: {state.sensors.voltage[2]} V </div>
        <div>Voltage 4: {state.sensors.voltage[3]} V </div>
        <div>Voltage 5: {state.sensors.voltage[4]} V </div>
        <div>Voltage 6: {state.sensors.voltage[5]} V </div>
        <br></br>
        <div>Current 1: {state.sensors.current[0]} A </div>
        <div>Current 2: {state.sensors.current[1]} A </div>
        <div>Current 3: {state.sensors.current[2]} A </div>
        <div>Current 4: {state.sensors.current[3]} A </div>
        <div>Current 5: {state.sensors.current[4]} A </div>
        <div>Current 6: {state.sensors.current[5]} A </div>
        <br></br>
        <div>Temperature 1: {state.sensors.temperature[0]} C </div>
        <div>Temperature 2: {state.sensors.temperature[1]} C </div>
        <div>Temperature 3: {state.sensors.temperature[2]} C </div>
        <div>Temperature 4: {state.sensors.temperature[3]} C </div>

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
