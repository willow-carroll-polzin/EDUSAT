import SerialPort from "serialport";
/*      SYSTEM STATES     */
export interface SensorStatus {
    voltage:Array<number>;
    current:Array<number>;
    temperature: Array<number>;
}

export interface ComPort {
    path: string
    manu: string
}

export interface State {
    sensor: SensorStatus;
    port?: SerialPort;
}

/*      ACTIONS     */
export interface UpdateSensorData {
    type:"UpdateSensorData"
    voltage:Array<number>;
    current:Array<number>;
    temperature:Array<number>;
}

export interface UpdateComPort {
    type: "UpdateComPort";
    port: SerialPort;
}

/*      TYPES     */
export type Action =  UpdateSensorData | UpdateComPort;
export type Connectable = SensorStatus;
