import {
  type ConnectData,
  type PatchData,
  type ReplaceData,
  type ResetData,
} from "../types/data";
import type { AddConnection, Broadcast, Groups, Send } from "../types/groups";

import { IncomingMessage, ServerResponse } from "http";
import { WebSocket } from "ws";

import { EventType } from '../types/data.js';
import {
  initGroup,
  patchGroup,
  removeOldGroups,
  replaceGroup,
} from "./groups.js";
import { log, LogLevel } from "./log.js";

interface GetRouteParams<T extends WebSocket | ServerResponse<IncomingMessage>> {
  groups: Groups;
  send: Send<T>;
  broadcast: Broadcast<T>;
  addConnection: AddConnection<T>;
}

export function getRoutes<
  T extends WebSocket | ServerResponse<IncomingMessage>,
>(params: GetRouteParams<T>) {
  const { groups, broadcast, addConnection } = params;
  return {
    connect(data: ConnectData, connection: T, uid?: string) {
      if (data.id) {
        log(`Client "${uid}" connected to group "${data.id}"`, LogLevel.WARN);
        addConnection(connection, data.id);
        removeOldGroups(groups);
        if (!groups.has(data.id)) {
          initGroup(groups, data.id, data.states);
        } else if (data.states) {
          replaceGroup(groups, data.id, data.states);
          broadcast(data.id, data.states, uid);
        }
      }
    },
    patch(data: PatchData, uid?: string) {
      if (data.id && groups.has(data.id)) {
        patchGroup(groups, data.id, data.states);
        broadcast(data.id, data.states, uid, EventType.PATCH);
      }
    },
    replace(data: ReplaceData, uid?: string) {
      if (data.id && groups.has(data.id)) {
        replaceGroup(groups, data.id, data.states);
        broadcast(data.id, data.states, uid);
      }
    },
    reset(data: ResetData, uid?: string) {
      if (data.id && groups.has(data.id)) {
        replaceGroup(groups, data.id, {});
        broadcast(data.id, {}, uid);
      }
    },
  };
}
