import { Socket } from "socket.io";
import { ListenEvents } from "./types";

export const hookMessageEvent = (
  socket: Socket<ListenEvents>
): Socket<ListenEvents> => socket.on("message", () => {});
