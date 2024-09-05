export type State = Record<string, unknown>;

export type States = Record<string, State>

export enum DataType {
  CONNECT = "connect",
  REPLACE = "replace",
  RESET = "reset",
}

export enum EventType {
  REPLACE = "replace",
  RESET = "reset",
}

export interface Data {
  id: string;
}

export interface WsData extends Data {
  type: DataType;
}

export interface ConnectData extends Data {
  states?: States;
}

export interface WsConnectData extends ConnectData {
  type: DataType.CONNECT;
}

export interface ReplaceData extends Data {
  states: States
}

export interface WsReplaceData extends ReplaceData {
  type: DataType.REPLACE;
}

export interface ResetData extends Data {}

export interface WsResetData extends ResetData {
  type: DataType.RESET;
}
