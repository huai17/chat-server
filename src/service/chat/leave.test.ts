import { hookLeaveEvent } from "./leave";
import { hookJoinEvent } from "./join";
import { ChatError } from "./types";
import { createServer, Server as HttpServer } from "http";
import { AddressInfo } from "net";
import { Server, Socket as ServerSocket } from "socket.io";
import { io, Socket } from "socket.io-client";

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
      hookLeaveEvent(socket);
    });
    httpServer.listen(done);
  });
});

describe("leave room", () => {
  let srv: Server;
  let srvSocket: ServerSocket;
  let client: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      srvSocket = socket;
      hookJoinEvent(socket, srv);
      hookLeaveEvent(socket);
    });
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      client = io(`http://localhost:${port}`);
      client.on("connect", () => {
        client.emit("join", "name", "room", () => {
          done();
        });
      });
    });
  });

  afterAll(() => {
    srv.close();
    client.close();
  });

  test("should update socket data", (done) => {
    client.emit("leave", () => {
      expect(srvSocket.data).toMatchObject({ name: null, room: null });
      done();
    });
  });
});

describe("not in room", () => {
  let srv: Server;
  let client: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookLeaveEvent(socket);
    });
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      client = io(`http://localhost:${port}`);
      client.on("connect", done);
    });
  });

  afterAll(() => {
    srv.close();
    client.close();
  });

  test("should ack error", (done) => {
    client.emit("leave", (err: ChatError | null) => {
      expect(err).toBe(ChatError.NOT_IN_ROOM);
      done();
    });
  });
});

describe("leave non-empty room", () => {
  let srv: Server;
  let client: Socket;
  let newClient: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookJoinEvent(socket, srv);
      hookLeaveEvent(socket);
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
    newClient.close();
  });

  test("should receive left event", (done) => {
    const id = newClient.id;
    client.on("left", (socketId) => {
      expect(socketId).toBe(id);
      done();
    });
    newClient.emit("leave");
  });
});
