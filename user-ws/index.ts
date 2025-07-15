import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

type Room = {
  sockets: WebSocket[];
};

const rooms: Record<string, Room> = {};

wss.on("connection", function connection(ws: WebSocket) {
  ws.on("error", console.error);

  ws.on("message", function message(data: WebSocket.RawData) {
    //check if data is a string
    const message = typeof data == "string" ? data : data.toString();
    console.log("Message received: ", message);

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
    else if (parsedData.type == "chat") {
      const room = parsedData.room;
      rooms[room]?.sockets.map(socket => socket.send(data));
    }
  });

  ws.send("something");
});
