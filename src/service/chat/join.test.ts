import { hookJoinEvent } from "./join";
import { createServer, Server as HttpServer } from "http";
import { Server } from "socket.io";

describe("join event", () => {
  let httpServer: HttpServer;
  let srv: Server;

  beforeAll(() => {
    httpServer = createServer();
    srv = new Server(httpServer);
  });

  afterAll(() => {
    srv.close();
  });

  test("should hook the event and start the server without error", (done) => {
    srv.on("connection", (socket) => {
      hookJoinEvent(socket);
    });
    httpServer.listen(done);
  });
});
