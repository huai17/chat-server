import { Server as HttpServer } from "http";
import { Socket, Server, ServerOptions } from "socket.io";

export const hookChatService = (
  srv: HttpServer,
  opt: Partial<ServerOptions> = {}
): Server => {
  const io = new Server(srv, { path: "/chat-service/", ...opt });

  return io.on("connection", (socket: Socket) => {
    // init socket data
    socket.data = { name: null, room: null };

    // hook listeners
  });
};
