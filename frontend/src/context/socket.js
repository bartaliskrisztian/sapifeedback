import React from "react";
import socketio from "socket.io-client";

// creating a context for using websockets in order to communicate the client and server in real time

export const socket = socketio.connect(process.env.REACT_APP_SERVER_URL);
export const SocketContext = React.createContext();