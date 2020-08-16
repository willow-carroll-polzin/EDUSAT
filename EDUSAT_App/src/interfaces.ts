import SerialPort from "serialport";
/*      SYSTEM STATES     */
export interface SensorStatus {
    volts: {v1: number, v2: number, v3: number, v4: number, v5: number, v6: number};
    amps: {i1: number, i2: number, i3: number, i4: number, i5: number, i6: number};
    temps: {t1: number, t2: number, t3: number, t4: number};
}

export interface State {
    sensor: SensorStatus;
    port?: SerialPort;
}

/*      ACTIONS     */
export interface UpdateSensorData {
    type:"UpdateSensorData";
    volts: {v1: number, v2: number, v3: number, v4: number, v5: number, v6: number};
    amps: {i1: number, i2: number, i3: number, i4: number, i5: number, i6: number};
    temps: {t1: number, t2: number, t3: number, t4: number};
}

export interface UpdateComPort {
    type: "UpdateComPort";
    port: SerialPort;
}

/*      TYPES     */
export type Action = UpdateSensorData | UpdateComPort;
export type Connectable = SensorStatus;
