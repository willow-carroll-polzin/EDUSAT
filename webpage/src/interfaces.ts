/*      SYSTEM STATES FOR GUI       */
export interface SensorStatus {
    voltage:Array<number>;
    current:Array<number>;
    temperature: Array<number>;
}

export interface State {
    sensors: SensorStatus;
}

/*      ACTIONS     */
export interface UpdateSensorData {
    type:"UpdateSensorData"
    voltage:Array<number>;
    current:Array<number>;
    temperature:Array<number>;
}

/*      TYPES     */
export type Action = UpdateSensorData
export type Connectable = SensorStatus;

