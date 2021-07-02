import { createChatServer } from "./service/server";

// server config
const PORT = 5566;

// server setup
const srv = createChatServer();

// start the server
srv.listen(PORT, () => {
  console.log(`Server start listening on port ${PORT}...`);
});
