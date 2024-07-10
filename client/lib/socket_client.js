import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (socket) {
    console.log("old socket")
  }
  if (!socket) {
    console.log("new socket");
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      reconnection: false,
    });
  }
  return socket;
};

export const getSocket = () => {
  console.log("socketconfig", socket);
  return socket;
};
