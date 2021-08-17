import { Socket, Server, RemoteSocket } from "socket.io";
import { ListenEvents, EmitEvents, ChatError } from "./types";
import { option, io, array, task, either } from "fp-ts";
import { pipe, flow, unsafeCoerce, identity } from "fp-ts/lib/function";

export const hookJoinEvent = (
  s: Socket<ListenEvents, EmitEvents>,
  srv: Server<ListenEvents, EmitEvents>
): Socket<ListenEvents, EmitEvents> =>
  s.on("join", async (n?: any, r?: any, cb?: any): Promise<void> => {
    const act = pipe(
      validateName(n),
      either.chain((name) =>
        flow(
          () => validateRoom(r),
          either.map((room) => ({ name, room } as Required<SocketData>))
        )()
      ),
      either.chain((d) =>
        isInRoom(s) ? either.left(ChatError.ALREADY_IN_ROOM) : either.right(d)
      ),
      either.map(
        flow(
          (d) => setSocketData(d, s),
          (d) => void s.join(d.room) || d,
          (d) => void s.to(d.room).emit("joined", s.id, d.name) || d
        )
      ),
      (fe) =>
        callbackIO(
          (saveCallBack) =>
            pipe(
              fe,
              either.map(
                flow((d) => getRoomSockets(d.room, srv), task.map(getMembers))
              ),
              either.fold(
                (e): io.IO<void> =>
                  () =>
                    void saveCallBack(e),
                task.chainIOK((m) => () => void saveCallBack(null, m))
              )
            ),
          cb
        ),
      option.fold(() => () => void 0, identity)
    );

    act();

    // // input check
    // if (!name || typeof name !== "string")
    //   return void (typeof cb === "function" && cb(ChatError.INVALID_NAME));
    // if (!room || typeof room !== "string")
    //   return void (typeof cb === "function" && cb(ChatError.INVALID_ROOM));
    // // socket room data check
    // if (socket.data.room)
    //   return void (typeof cb === "function" && cb(ChatError.ALREADY_IN_ROOM));

    // // update socket data
    // socket.data = { name, room };
    // // join room
    // socket.join(room);
    // // notice members in room
    // socket.to(room).emit("joined", socket.id, name);
    // // fetch room members
    // const sockets = await io.in(socket.data.room).fetchSockets();
    // // create member map
    // const members: { [id: string]: string } = {};
    // for (const {
    //   id,
    //   data: { name },
    // } of sockets)
    //   members[id] = name;

    // // callback
    // if (typeof cb === "function") cb(null, members);
  });

const validateNonEmptyString =
  <E>(err: E) =>
  (s: any): either.Either<E, string> =>
    typeof s !== "string" || !s ? either.left(err) : either.right(s);
const validateName = validateNonEmptyString(ChatError.INVALID_NAME);
const validateRoom = validateNonEmptyString(ChatError.INVALID_ROOM);

interface SocketData {
  readonly name?: string;
  readonly room?: string;
}
interface SocketLike {
  readonly id: string;
  data: any;
}
interface MemberMap {
  [id: string]: string;
}
type Callbcak = (...args: any[]) => any;
const getSocketData = (s: SocketLike) => unsafeCoerce<any, SocketData>(s.data);
const getSocketId = (s: SocketLike) => s.id;
const setSocketData = (d: Required<SocketData>, s: SocketLike) => (s.data = d);
const isInRoom = flow(getSocketData, (d) => Boolean(d.room));
const getRoomSockets =
  <LE, EE, SSE>(
    r: string,
    srv: Server<LE, EE, SSE>
  ): task.Task<RemoteSocket<EE>[]> =>
  () =>
    srv.in(r).fetchSockets();
const getMembers: (socket: SocketLike[]) => MemberMap = array.reduce(
  {},
  (prev, cur) => {
    const id = getSocketId(cur);
    const name = getSocketData(cur).name;
    return { ...prev, [id]: name };
  }
);
const callbackIO = (f: (saveCallBack: Callbcak) => io.IO<void>, cb: any) =>
  pipe(
    option.fromNullable(typeof cb === "function" ? (cb as Callbcak) : null),
    option.map(f)
  );
