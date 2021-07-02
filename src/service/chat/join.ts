import { Socket } from "socket.io";
import { ListenEvents } from "./types";

export const hookJoinEvent = (
  socket: Socket<ListenEvents>
): Socket<ListenEvents> => socket.on("join", () => {});
