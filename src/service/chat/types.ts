export interface ListenEvents {
  join: (name?: any, room?: any, cb?: any) => Promise<void>;
  leave: (cb?: any) => void;
  message: (message?: any, cb?: any) => void;
}

export interface EmitEvents {
  joined: (socketId: string, name: string) => void;
  left: (socketId: string) => void;
  message: (socketId: string, message: string) => void;
}

export enum ChatError {
  INVALID_NAME = "INVALID_NAME",
  INVALID_ROOM = "INVALID_ROOM",
  INVALID_MESSAGE = "INVALID_MESSAGE",
  ALREADY_IN_ROOM = "ALREADY_IN_ROOM",
  NOT_IN_ROOM = "NOT_IN_ROOM",
}
