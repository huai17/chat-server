import { Socket } from "socket.io";
import { ListenEvents, EmitEvents, ChatError } from "./types";

export const hookLeaveEvent = (
  socket: Socket<ListenEvents, EmitEvents>
): Socket<ListenEvents, EmitEvents> =>
  socket.on("leave", (cb?: any) => {
    // socket room data check
    if (!socket.data.room)
      return void (typeof cb === "function" && cb(ChatError.NOT_IN_ROOM));

    // update socket data
    const room = socket.data.room;
    socket.data = { name: null, room: null };
    // leave room
    socket.leave(room);
    // notice members in room
    socket.to(room).emit("left", socket.id);

    if (typeof cb === "function") cb(null);
  });
