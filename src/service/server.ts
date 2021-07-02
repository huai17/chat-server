import { createServer, Server } from "http";
import { hookChatService } from "./chat";

export const createChatServer = (): Server => {
  const srv = createServer();

  // hook chat service
  hookChatService(srv);

  return srv;
};
