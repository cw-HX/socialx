import React, { createContext, useEffect, useState} from 'react';
import socketIoClient from 'socket.io-client';


export const SocketContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || '';
const WS = API_URL || window.location.origin;

const socket = socketIoClient(WS);

export const SocketContextProvider =  ({children}) => {
    return <SocketContext.Provider  value={{socket}} >{children}</SocketContext.Provider>
}

