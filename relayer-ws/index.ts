import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8081 });

const servers: WebSocket[] = [];

wss.on("connection", function connection(ws: WebSocket) {
  ws.on("error", console.error);
  servers.push(ws);

  ws.on("message", function messsage(data: WebSocket.RawData) {
    const message = typeof data == "string" ? data : data.toString();
    console.log("Message received: ", message);

    servers.map((socket) => {
      socket.send(data);
    });
  });
});

