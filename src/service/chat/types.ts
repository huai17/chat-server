export interface ListenEvents {
  join: (...args: any[]) => void;
  leave: (...args: any[]) => void;
  message: (...args: any[]) => void;
}
