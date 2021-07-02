import { Server } from "http";
import { createChatServer } from "./server";

describe("chat server", () => {
  let srv: Server;

  afterAll(() => {
    srv.close();
  });

  test("should start without error", (done) => {
    srv = createChatServer();
    srv.listen(done);
  });
});
