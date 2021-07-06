import { Socket } from "socket.io";
import { ListenEvents, EmitEvents } from "./types";

export const hookDisconnectingEvent = (
  socket: Socket<ListenEvents, EmitEvents>
): Socket<ListenEvents, EmitEvents> =>
  socket.on("disconnecting", (): void => {
    // notice members in room
    if (socket.data.room) socket.to(socket.data.room).emit("left", socket.id);
  });
