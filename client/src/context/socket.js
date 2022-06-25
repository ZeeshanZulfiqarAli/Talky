import React from 'react';
import { io } from "socket.io-client";
// import { SOCKET_URL } from "config";

let SOCKET_URL = '';
if (process.env.NODE_ENV === 'production') {
    SOCKET_URL = window.location.hostname + ':';
} else {
    SOCKET_URL = (process.env.YOUR_HOST || '0.0.0.0') + ':' + (process.env.PORT || 5000);
}
// const SOCKET_URL = window.location.hostname + ':'
// const SOCKET_URL = process.env.YOUR_HOST || '0.0.0.0' + ':' + process.env.PORT || 5000;
console.log('socket url', SOCKET_URL);
export const socket = io(SOCKET_URL);
export const SocketContext = React.createContext();