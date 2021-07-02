import { hookMessageEvent } from "./message";
import { hookJoinEvent } from "./join";
import { ChatError } from "./types";
import { createServer, Server as HttpServer } from "http";
import { AddressInfo } from "net";
import { Server } from "socket.io";
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
      hookMessageEvent(socket);
    });
    httpServer.listen(done);
  });
});

describe("not in room", () => {
  let srv: Server;
  let client: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookMessageEvent(socket);
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
    client.emit("message", "hello world", (err: ChatError | null) => {
      expect(err).toBe(ChatError.NOT_IN_ROOM);
      done();
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
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
        hookMessageEvent(socket);
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
      client.emit("message", input, (err: ChatError | null) => {
        expect(err).toBe(ChatError.INVALID_MESSAGE);
        done();
      });
    });
  });
});

describe("send message", () => {
  let srv: Server;
  let client: Socket;
  let newClient: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    srv = new Server(httpServer);
    srv.on("connection", (socket) => {
      hookJoinEvent(socket, srv);
      hookMessageEvent(socket);
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

  test("should receive message event", (done) => {
    client.on("message", (socketId, message) => {
      expect(socketId).toBe(newClient.id);
      expect(message).toBe("hello world");
      done();
    });
    newClient.emit("message", "hello world");
  });
});
