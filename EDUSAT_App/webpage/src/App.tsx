/*  REQUIRED LIBRARIES  */
import React from "react";
import { connect } from "react-redux";
import { State } from "./interfaces";
import Chart from "chart.js"

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
        <script>
            
        </script>
    </React.Fragment>
);
const ChartBox = (state:State) => (
    <React.Fragment>
         <canvas id="myChart" width="400" height="400"></canvas>
         <div>{myChart}</div>
    </React.Fragment>
);
//var ctx = document.getElementById('myChart');

//THIS SECTION BELOW IS WHAT IS MAKING IT MESS UP
const ctx = new CanvasRenderingContext2D();
/*
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Voltage', 'Current', 'Temperature'],
        datasets: [{
            label: 'Value',
            data: [10,10,10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});*/


//Export new functions that connect our html returning functions to our store
export const SensorsConnected = connector(Sensors);
export const RSidebarConnected = connector(RSidebar);
export const LSidebarConnected = connector(LSidebar);
export const ChartConnected = connector(ChartBox);