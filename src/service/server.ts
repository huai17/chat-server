import { createServer, Server } from "http";
import { ServerOptions } from "socket.io";
import { hookChatService } from "./chat";

export const createChatServer = (opt?: Partial<ServerOptions>): Server => {
  const srv = createServer();

  // hook chat service
  hookChatService(srv, opt);

  return srv;
};
