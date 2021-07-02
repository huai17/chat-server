import { hookChatService } from "./index";
import { createServer, Server as HttpServer } from "http";
import { AddressInfo } from "net";
import { io, Socket } from "socket.io-client";

describe("chat service", () => {
  let srv: HttpServer;

  beforeAll(() => {
    srv = createServer();
  });

  afterAll(() => {
    srv.close();
  });

  test("should hook the service and start the server without error", (done) => {
    hookChatService(srv);
    srv.listen(done);
  });
});

describe("connected socket", () => {
  let srv: HttpServer;
  let client: Socket;

  beforeAll(() => {
    srv = createServer();
  });

  afterAll(() => {
    srv.close();
    client.close();
  });

  test("should be set to default", (done) => {
    const chatSrv = hookChatService(srv);
    srv.listen(() => {
      const { port } = srv.address() as AddressInfo;
      client = io(`http://localhost:${port}`, { path: "/chat-service/" });
      client.on("connect", async () => {
        const sockets = await chatSrv.fetchSockets();
        const socket = sockets.find(({ id }) => id === client.id);
        if (!socket) throw new Error("socket not found");
        expect(socket.data).toMatchObject({ name: null, room: null });
        done();
      });
    });
  });
});
