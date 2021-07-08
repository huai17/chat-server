import { hookDisconnectingEvent } from "./disconnecting";
import { hookJoinEvent } from "./join";
import { createServer, Server as HttpServer } from "http";
import { AddressInfo } from "net";
import { Server } from "socket.io";
import { io, Socket } from "socket.io-client";

describe("disconnecting event", () => {
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
      hookDisconnectingEvent(socket);
    });
    httpServer.listen(done);
  });
});

describe("disconnect from non-empty room", () => {
  let srv: Server;
  let client: Socket;
  let newClient: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookJoinEvent(socket, srv);
      hookDisconnectingEvent(socket);
    });
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      client = io(`http://localhost:${port}`);
      client.on("connect", () => {
        client.emit("join", "name", "room", () => {
          newClient = io(`http://localhost:${port}`);
          newClient.on("connect", () => {
            newClient.emit("join", "new name", "room", () => {
              done();
            });
          });
        });
      });
    });
  });

  afterAll(() => {
    srv.close();
    client.close();
  });

  test("should receive left event", (done) => {
    const id = newClient.id;
    client.on("left", (socketId) => {
      expect(socketId).toBe(id);
      done();
    });
    newClient.close();
  });
});
