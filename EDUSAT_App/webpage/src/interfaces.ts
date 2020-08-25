/*      SYSTEM STATES FOR GUI       */
export interface SensorStatus {
    selection: {heartRate: boolean, temperature: boolean};
    values: {heartRate: number, temperature: number};
}

export interface State {
    sensors: SensorStatus;
}

/*      ACTIONS     */
export interface UpdateSensorData {
    type:"UpdateSensorData"
    selection: {heartRate: boolean, temperature: boolean}
    values: {heartRate: number, temperature: number}
}

/*      TYPES     */
export type Action = UpdateSensorData
export type Connectable = SensorStatus;

