import type { ConnectData, ReplaceData, ResetData } from "../types/data";
import type { AddConnection, Broadcast, Group, Groups, Send } from "../types/groups";

import { IncomingMessage, ServerResponse } from "http";
import { WebSocket } from "ws";

import { initGroup, removeOldGroups, updateGroup } from "./groups.js";
import { log, LogLevel } from "./log.js";

export function getRoutes<
  T extends WebSocket | ServerResponse<IncomingMessage>,
>(
  groups: Groups,
  send: Send<T>,
  broadcast: Broadcast<T>,
  addConnection: AddConnection<T>,
) {
  return {
    connect(data: ConnectData, connection: T, uid?: string) {
      if (data.id) {
        log(`Client "${uid}" connected to group "${data.id}"`, LogLevel.WARN);
        addConnection(connection, data.id);
        removeOldGroups(groups);
        if (!groups.has(data.id)) {
          initGroup(groups, data.id, data.states);
        } /*else {
          const group = groups.get(data.id) as Group;
          send(connection, group.states, uid);
        }*/
      }
    },
    replace(data: ReplaceData, uid?: string) {
      if (data.id && groups.has(data.id)) {
        updateGroup(groups, data.id, data.states);
        broadcast(data.id, data.states, uid);
      }
    },
    reset(data: ResetData, uid?: string) {
      if (data.id && groups.has(data.id)) {
        updateGroup(groups, data.id, {});
        broadcast(data.id, {}, uid);
      }
    },
  };
}
