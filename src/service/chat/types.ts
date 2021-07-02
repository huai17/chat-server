export interface ListenEvents {
  join: (name?: any, room?: any, cb?: any) => void;
  leave: (cb?: any) => void;
  message: (...args: any[]) => void;
}

export interface EmitEvents {
  joined: (socketId: string, name: string) => void;
  left: (socketId: string) => void;
}

export enum ChatError {
  INVALID_NAME = "INVALID_NAME",
  INVALID_ROOM = "INVALID_ROOM",
  ALREADY_IN_ROOM = "ALREADY_IN_ROOM",
  NOT_IN_ROOM = "NOT_IN_ROOM",
}
