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
      hookJoinEvent(socket, srv);
    });
    httpServer.listen(done);
  });
});

describe("join room", () => {
  let srv: Server;
  let srvSocket: ServerSocket;
  let client: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      srvSocket = socket;
      hookJoinEvent(socket, srv);
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

  test("should update socket data", (done) => {
    client.emit("join", "name", "room", () => {
      expect(srvSocket.data).toMatchObject({ name: "name", room: "room" });
      done();
    });
  });
});

describe("already in one room", () => {
  describe("join same room", () => {
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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

    test("should ack error", (done) => {
      client.emit("join", "name", "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.ALREADY_IN_ROOM);
        done();
      });
    });
  });

  describe("join another room", () => {
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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

    test("should ack error", (done) => {
      client.emit("join", "name", "another room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.ALREADY_IN_ROOM);
        done();
      });
    });
  });
});

describe("invalid user name", () => {
  describe("which is undefined", () => {
    const input = undefined;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is null", () => {
    const input = null;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an empty string", () => {
    const input = "";
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is a numebr", () => {
    const input = 123;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is zero", () => {
    const input = 0;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is true", () => {
    const input = true;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is false", () => {
    const input = false;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an empty object", () => {
    const input = {};
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an object", () => {
    const input = { hello: "world" };
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is a function", () => {
    const input = () => void 0;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an empty array", () => {
    const input: any[] = [];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an array of string", () => {
    const input = ["hello", "world"];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an array of number", () => {
    const input = [0, 1, 2];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an array of boolean", () => {
    const input = [true, false];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an array of object", () => {
    const input = [{}, { hello: "world" }];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });

  describe("which is an array of function", () => {
    const input = [() => void 0, () => void 0];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", input, "room", (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_NAME);
        done();
      });
    });
  });
});

describe("invalid room name", () => {
  describe("which is undefined", () => {
    const input = undefined;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is null", () => {
    const input = null;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an empty string", () => {
    const input = "";
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is a numebr", () => {
    const input = 123;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is zero", () => {
    const input = 0;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is true", () => {
    const input = true;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is false", () => {
    const input = false;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an empty object", () => {
    const input = {};
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an object", () => {
    const input = { hello: "world" };
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is a function", () => {
    const input = () => void 0;
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an empty array", () => {
    const input: any[] = [];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an array of string", () => {
    const input = ["hello", "world"];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an array of number", () => {
    const input = [0, 1, 2];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an array of boolean", () => {
    const input = [true, false];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an array of object", () => {
    const input = [{}, { hello: "world" }];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });

  describe("which is an array of function", () => {
    const input = [() => void 0, () => void 0];
    let srv: Server;
    let client: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer);
      srv.on("connection", (socket) => {
        hookJoinEvent(socket, srv);
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
      client.emit("join", "name", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_ROOM);
        done();
      });
    });
  });
});

describe("join new room", () => {
  let srv: Server;
  let client: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookJoinEvent(socket, srv);
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

  test("should ack member list", (done) => {
    client.emit(
      "join",
      "name",
      "room",
      (err: ChatError | null, members: { id: string; name: string }[]) => {
        expect(err).toBeNull();
        expect(members.length).toBe(1);
        expect(
          members.find(({ id, name }) => id === client.id && name === "name")
        ).toMatchObject({ id: client.id, name: "name" });
        done();
      }
    );
  });
});

describe("join existing room", () => {
  let srv: Server;
  let client: Socket;
  let newClient: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookJoinEvent(socket, srv);
    });
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      client = io(`http://localhost:${port}`);
      client.on("connect", () => {
        client.emit("join", "name", "room", () => {
          newClient = io(`http://localhost:${port}`);
          newClient.on("connect", done);
        });
      });
    });
  });

  afterAll(() => {
    srv.close();
    client.close();
    newClient.close();
  });

  test("should ack member list", (done) => {
    newClient.emit(
      "join",
      "new name",
      "room",
      (err: ChatError | null, members: { id: string; name: string }[]) => {
        expect(err).toBeNull();
        expect(members.length).toBe(2);
        expect(
          members.find(({ id, name }) => id === client.id && name === "name")
        ).toMatchObject({ id: client.id, name: "name" });
        expect(
          members.find(
            ({ id, name }) => id === newClient.id && name === "new name"
          )
        ).toMatchObject({ id: newClient.id, name: "new name" });
        done();
      }
    );
  });
});

describe("join existing room", () => {
  let srv: Server;
  let client: Socket;
  let newClient: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookJoinEvent(socket, srv);
    });
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      client = io(`http://localhost:${port}`);
      client.on("connect", () => {
        client.emit("join", "name", "room", () => {
          newClient = io(`http://localhost:${port}`);
          newClient.on("connect", done);
        });
      });
    });
  });

  afterAll(() => {
    srv.close();
    client.close();
    newClient.close();
  });

  test("should receive joined event", (done) => {
    client.on("joined", (socketId, name) => {
      expect(socketId).toBe(newClient.id);
      expect(name).toBe("new name");
      done();
    });
    newClient.emit("join", "new name", "room");
  });
});
