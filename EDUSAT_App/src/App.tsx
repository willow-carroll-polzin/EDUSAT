/*  REQUIRED LIBRARIES  */
import { app, BrowserWindow } from "electron";
import React from "react"
import ReactDOM from "react-dom"
import {connect} from "react-redux"
import * as path from "path";
import SerialPort from "serialport";
import { createStore } from "redux";
import {Provider} from "react-redux"
import {
  SensorStatus,
  State,
  Action,
  UpdateSensorData,
  UpdateComPort,
} from "./interfaces";



//////////////////////////
/*      REACT SETUP     */

/* Require functions to connect react to redux*/
const mapStateToProps = (state: State) => ({
    sensor: state.sensor
  })
  
  const dispatchProps ={
    updateSensorData: () =>{
      type: "UpdateSensorData"
    }
  }
  
  const connector = connect(mapStateToProps,dispatchProps)
  
  /*Custom functions to return react fragments using redux state properties*/
  // These fragments are used in main.tsx
  const sectionOne_RENAME_ME = (state: State) => (
    <React.Fragment>
      <div>Hello</div>
      <div>My state can be accessed like this: {state.sensor.volts.v1}</div>
    </React.Fragment>
  )
  export const SectionOneConnected = connector(sectionOne_RENAME_ME);

  const sectionTwo_RENAME_ME = (state: State) => (
    <React.Fragment>
      <div>Hello</div>
      <div>My state can be accessed like this: {state.sensor.volts.v1}</div>
    </React.Fragment>
  )
  export const SectionTwoConnected = connector(sectionTwo_RENAME_ME);
  
  const sectionThree_RENAME_ME = (state: State) => (
    <React.Fragment>
      <div>Hello</div>
      <div>My state can be accessed like this: {state.sensor.volts.v1}</div>
    </React.Fragment>
  )
  export const SectionThreeConnected = connector(sectionThree_RENAME_ME);
  