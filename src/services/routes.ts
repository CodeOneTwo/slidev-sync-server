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
        log(`Client connected to group "${data.id}"`, LogLevel.WARN);
        addConnection(connection, data.id);
        removeOldGroups(groups);
        if (!groups.has(data.id)) {
          initGroup(groups, data.id, data.state);
        } else {
          const group = groups.get(data.id) as Group;
          send(connection, group.state, uid);
        }
      }
    },
    replace(data: ReplaceData, uid?: string) {
      if (data.id && groups.has(data.id)) {
        const group = groups.get(data.id) as Group;
        group.state = data.state;
        updateGroup(groups, data.id, group);
        broadcast(data.id, data.state, uid);
      }
    },
    reset(data: ResetData, uid?: string) {
      if (data.id && groups.has(data.id)) {
        const group = groups.get(data.id) as Group;
        group.state = {};
        updateGroup(groups, data.id, group);
        broadcast(data.id, {}, uid);
      }
    },
  };
}
