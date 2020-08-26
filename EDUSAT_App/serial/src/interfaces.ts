import SerialPort from "serialport";
/*      SYSTEM STATES     */
export interface RobotStatus {
    connected: boolean;
    voltage: number;
}

export interface SensorStatus {
    selection: {heartRate: boolean, temperature: boolean};
    values: {heartRate: number, temperature: number};
}

export interface DrivetrainStatus {
    axes: Axes;
    toggle: { start: number; stop: number };
}

export interface ComPort {
    path: string
    manu: string
}

export interface Axes {
    x: number;
    y: number;
    om: number;
}

export interface State {
    robot: RobotStatus;
    sensor: SensorStatus;
    drive: DrivetrainStatus;
    port?: SerialPort;
}

/*      ACTIONS     */
export interface UpdateSensorData {
    type:"UpdateSensorData";
    selection: {heartRate: boolean, temperature: boolean};
    values: {heartRate: number, temperature: number};
}

export interface UpdateRobotData {
    type:"UpdateRobotData";
    connected: boolean;
    voltage: number;

}

export interface UpdateDrivetrainData {
    type: "UpdateDrivetrainData";
    axes: Axes;
    toggle: { start: number; stop: number };
}

export interface UpdateComPort {
    type: "UpdateComPort";
    port: SerialPort;
}

/*      TYPES     */
export type Action =  UpdateRobotData | UpdateSensorData | UpdateDrivetrainData | UpdateComPort;
export type Connectable = RobotStatus | DrivetrainStatus | SensorStatus;
