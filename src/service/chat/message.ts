import { Socket } from "socket.io";
import { ListenEvents, EmitEvents, ChatError } from "./types";

export const hookMessageEvent = (
  socket: Socket<ListenEvents, EmitEvents>
): Socket<ListenEvents, EmitEvents> =>
  socket.on("message", (message?: any, cb?: any) => {
    // input check
    if (!message || typeof message !== "string")
      return void (typeof cb === "function" && cb(ChatError.INVALID_MESSAGE));
    // socket room data check
    if (!socket.data.room)
      return void (typeof cb === "function" && cb(ChatError.NOT_IN_ROOM));

    // notice members in room
    socket.to(socket.data.room).emit("message", socket.id, message);

    if (typeof cb === "function") cb(null);
  });
