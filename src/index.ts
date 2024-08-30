import { log, LogLevel } from "./services/log.js";

const port = Number(process.env.PORT ?? 8080);

(async function() {
  if (process.env.WS) {
    const { initServer } = await import("./services/websocket.js");
    initServer(port);
  } else {
    const { initServer } = await import("./services/sse.js");
    initServer(port);
  }

  log(`The server is running on port ${port}`, LogLevel.INFO, true);
})();
