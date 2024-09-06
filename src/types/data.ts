export type State = Record<string, unknown>;

export type States = Record<string, State>;

export enum DataType {
  CONNECT = "connect",
  PATCH = "patch",
  REPLACE = "replace",
  RESET = "reset",
}

export enum EventType {
  PATCH = "patch",
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
  uid: string;
}

export interface ReplaceData extends Data {
  states: States
}

export interface WsReplaceData extends ReplaceData {
  type: DataType.REPLACE;
  uid: string;
}

export interface PatchData extends Data {
  full?: boolean
  states: States
}

export interface WsPatchData extends PatchData {
  type: DataType.PATCH;
  uid: string;
}

export interface ResetData extends Data {}

export interface WsResetData extends ResetData {
  type: DataType.RESET;
  uid: string;
}
