import { io } from "socket.io-client";
import { rootURL } from "./api/config";

// const SOCKET_URL = generateFullUrl();

export const socket = io(rootURL, {
  autoConnect: false,
  transports: ["websocket"],
  extraHeaders: {
    "ngrok-skip-browser-warning": "true" 
  }
});
