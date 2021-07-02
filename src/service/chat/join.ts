import { Socket, Server } from "socket.io";
import { ListenEvents, EmitEvents, ChatError } from "./types";

export const hookJoinEvent = (
  socket: Socket<ListenEvents, EmitEvents>,
  io: Server<ListenEvents, EmitEvents>
): Socket<ListenEvents, EmitEvents> =>
  socket.on("join", async (name?: any, room?: any, cb?: any): Promise<void> => {
    // input check
    if (!name || typeof name !== "string")
      return void (typeof cb === "function" && cb(ChatError.INVALID_NAME));
    if (!room || typeof room !== "string")
      return void (typeof cb === "function" && cb(ChatError.INVALID_ROOM));
    // socket room data check
    if (socket.data.room)
      return void (typeof cb === "function" && cb(ChatError.ALREADY_IN_ROOM));

    // update socket data
    socket.data = { name, room };
    // join room
    socket.join(room);
    // notice members in room
    socket.to(room).emit("joined", socket.id, name);
    // fetch room members
    const sockets = await io.in(socket.data.room).fetchSockets();
    const members = sockets.map(({ id, data: { name } }) => ({ id, name }));

    if (typeof cb === "function") cb(null, members);
  });
