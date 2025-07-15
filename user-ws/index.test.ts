import { describe, expect, test } from "bun:test";

const BackendURL = "ws://localhost:8080";

describe("Chat application", () => {
  test("Message sent from room1 reaches another participant in room 1", async () => {
    const ws1 = new WebSocket(BackendURL);
    const ws2 = new WebSocket(BackendURL);

    await new Promise<void>((resolve, reject) => {
      let count = 0;
      ws1.onopen = () => {
        count++;
        if (count == 2) {
          resolve();
        }
      };
      ws2.onopen = () => {
        count++;
        if (count == 2) {
          resolve();
        }
      };
    });

    ws1.send(
      JSON.stringify({
        type: "join-room",
        room: "room-1",
      }),
    );
    ws2.send(
      JSON.stringify({
        type: "join-room",
        room: "room-1",
      }),
    );

    await new Promise<void>((resolve) => {
      ws2.onmessage = (event: MessageEvent) => {
        const parsedData = JSON.parse(event.data);
        expect(parsedData.type == "chat");
        expect(parsedData.message == "hi room 1");

        resolve();
      };
      ws1.send(
        JSON.stringify({
          type: "chat",
          room: "room-1",
          message: "hi room 1",
        }),
      );
    });
  });
});
