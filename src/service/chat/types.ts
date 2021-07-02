export interface ListenEvents {
  join: (name?: any, room?: any, cb?: any) => void;
  leave: (...args: any[]) => void;
  message: (...args: any[]) => void;
}

export interface EmitEvents {
  joined: (socketId: string, name: string) => void;
}

export enum ChatError {
  INVALID_NAME = "INVALID_NAME",
  INVALID_ROOM = "INVALID_ROOM",
  ALREADY_IN_ROOM = "ALREADY_IN_ROOM",
}
