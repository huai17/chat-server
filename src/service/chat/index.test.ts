import { hookChatService } from "./index";
import { createServer, Server as HttpServer } from "http";

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
