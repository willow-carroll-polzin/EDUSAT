/*      SERVER INTERFACES AND TYPES       */
export interface RobotStatus {
    connected: boolean;
    voltage: number;
}

export interface SensorStatus {
    selection: {heartRate: boolean, temperature: boolean};
    values: {heartRate: number, temperature: number};
}

export interface GamepadStatus {
    connected: boolean;
    axes: Axes;
    buttons: { start: number; stop: number };
}

export interface DrivetrainStatus {
    axes: Axes;
    buttons: { start: number; stop: number };
}

export interface Axes {
    x: number;
    y: number;
    om: number;
}