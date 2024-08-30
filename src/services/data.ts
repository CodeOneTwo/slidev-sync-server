import type {
  WsConnectData,
  WsData,
  WsReplaceData,
  WsResetData,
} from "../types/data";

import { DataType } from "../types/data.js";

export function isReplaceData(data: WsData): data is WsReplaceData {
  return data.type === DataType.REPLACE;
}

export function isConnectData(data: WsData): data is WsConnectData {
  return data.type === DataType.CONNECT;
}

export function isResetData(data: WsData): data is WsResetData {
  return data.type === DataType.RESET;
}
