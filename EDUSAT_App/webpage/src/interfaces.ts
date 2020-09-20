/*      SYSTEM STATES FOR GUI       */
export interface SensorStatus {
    voltage:Array<number>;
    current:Array<number>;
    temperature: Array<number>;
}

export interface State {
    sensors: SensorStatus;
    port: String;
}

/*      ACTIONS     */
export interface UpdateSensorData {
    type:"UpdateSensorData"
    voltage:Array<number>;
    current:Array<number>;
    temperature:Array<number>;
}

export interface UpdateComPortData{
    type:"UpdateComPortData"
    port:String;
}

/*      TYPES     */
export type Action = UpdateSensorData | UpdateComPortData;
export type Connectable = SensorStatus;

