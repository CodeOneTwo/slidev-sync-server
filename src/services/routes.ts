import {
  type ConnectData,
  type PatchData,
  type ReplaceData,
  type ResetData,
} from "../types/data";
import type { AddConnection, Broadcast, Groups, Send } from "../types/groups";

import { IncomingMessage, ServerResponse } from "http";
import { WebSocket } from "ws";

import { EventType } from "../types/data.js";
import {
  initGroup,
  patchGroup,
  removeOldGroups,
  replaceGroup,
} from "./groups.js";
import { log, LogLevel } from "./log.js";

interface GetRouteParams<
  T extends WebSocket | ServerResponse<IncomingMessage>,
> {
  addConnection: AddConnection<T>;
  broadcast: Broadcast<T>;
  groups: Groups;
  send: Send<T>;
}

export function getRoutes<
  T extends WebSocket | ServerResponse<IncomingMessage>,
>(params: GetRouteParams<T>) {
  const { addConnection, broadcast, groups, send } = params;

  function connect(data: ConnectData, connection: T, uid?: string) {
    if (data.id) {
      log(`Client "${uid}" connected to group "${data.id}"`, LogLevel.WARN);
      addConnection(connection, data.id);
      removeOldGroups(groups);
      if (!groups.has(data.id)) {
        initGroup(groups, data.id, data.states);
      } else {
        if (data.states) {
          patch(data as PatchData, uid);
        }
        const group = groups.get(data.id)!;
        send(connection, group.states);
      }
    }
  }

  function patch(data: PatchData, uid?: string) {
    if (data.id && groups.has(data.id)) {
      patchGroup(groups, data.id, data.states);
      const group = groups.get(data.id)!;
      let states = data.states;
      if (data.full) {
        states = Object.fromEntries(
          Object.keys(data.states).map((key) => [key, group.states[key]]),
        );
      }
      broadcast(data.id, states, uid, EventType.PATCH);
    }
  }

  function replace(data: ReplaceData, uid?: string) {
    if (data.id && groups.has(data.id)) {
      replaceGroup(groups, data.id, data.states);
      broadcast(data.id, data.states, uid);
    }
  }

  function reset(data: ResetData, uid?: string) {
    if (data.id && groups.has(data.id)) {
      replaceGroup(groups, data.id, {});
      broadcast(data.id, {}, uid);
    }
  }

  return { connect, patch, replace, reset };
}
