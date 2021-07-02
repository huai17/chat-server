import { Socket } from "socket.io";
import { ListenEvents } from "./types";

export const hookLeaveEvent = (
  socket: Socket<ListenEvents>
): Socket<ListenEvents> => socket.on("leave", () => {});
