import { WebSocketServer, WebSocket as WS } from "ws";

const wss = new WebSocketServer({ port: 8080 });

type Room = {
  sockets: WS[];
};

const rooms: Record<string, Room> = {};

const RelayerURL = "ws://localhost:8081";
const relayerSocket = new WebSocket(RelayerURL);

relayerSocket.onmessage = (event: MessageEvent) => {
  const data = event.data;
  const message = typeof data == "string" ? data : data.toString();
  console.log("Message received: ", message);

  const parsedData = JSON.parse(message);
  if (parsedData.type == "chat") {
    const room = parsedData.room;
    rooms[room]?.sockets.map((socket) => socket.send(data));
  }
};

wss.on("connection", function connection(ws: WS) {
  ws.on("error", console.error);

  ws.on("message", function message(data: WS.RawData) {
    //check if data is a string
    // const message = typeof data == "string" ? data : data.toString();
    // console.log("Message received: ", message);
    //
    // const parsedData = JSON.parse(message);
    // if (parsedData.type == "join-room") {
    //   const room = parsedData.room;
    //   if (!rooms[room]) {
    //     rooms[room] = {
    //       sockets: [],
    //     };
    //   }
    //
    //   rooms[room].sockets.push(ws);
    // }
    // else if (parsedData.type == "chat") {
    //   const room = parsedData.room;
    //   rooms[room]?.sockets.map(socket => socket.send(data));
    // }
    //
    const message = typeof data == "string" ? data : data.toString();

    const parsedData = JSON.parse(message);
    if (parsedData.type == "join-room") {
      const room = parsedData.room;
      if (!rooms[room]) {
        rooms[room] = {
          sockets: [],
        };
      }

      rooms[room].sockets.push(ws);
    }
    if (parsedData.type == "chat") {
      relayerSocket.send(data.toString());
    }
  });
});
