import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ListenEvents, EmitEvents } from "./types";
import { hookJoinEvent } from "./join";
import { hookLeaveEvent } from "./leave";
import { hookMessageEvent } from "./message";

export const hookChatService = (
  srv: HttpServer,
  opt: Partial<ServerOptions> = {}
): Server<ListenEvents, EmitEvents> => {
  const io = new Server<ListenEvents, EmitEvents>(srv, {
    path: "/chat-service/",
    ...opt,
  });

  return io.on("connection", (socket) => {
    // init socket data
    socket.data = { name: null, room: null };

    // hook events
    hookJoinEvent(socket, io);
    hookLeaveEvent(socket);
    hookMessageEvent(socket);
  });
};
