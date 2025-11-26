import React, { createContext, useReducer, useState, useEffect } from 'react'
import socketIoClient from 'socket.io-client';

export const GeneralContext = createContext();


const API_URL = process.env.REACT_APP_API_URL || '';
const WS = API_URL || window.location.origin;

const socket = socketIoClient(WS);

export const GeneralContextProvider = ({children}) => {

    const [isCreatPostOpen, setIsCreatePostOpen] = useState(false);
    const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);


    const [chatFirends, setChatFriends] = useState([]);
   

    const INITIAL_STATE = {
      chatId: 'null',
      user: {},
  };

  const userId = localStorage.getItem('userId');

  const chatReducer = (state, action) => {
      switch (action.type) {
          case "CHANGE_USER":
              return {
                  user: action.payload,
                  chatId: userId > action.payload._id ? userId + action.payload._id : action.payload._id + userId
              }
          default:
              return state;
      }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    // Reload page when key realtime events occur so feed/state refreshes across clients
    useEffect(() => {
        if (!socket) return;

        const reload = () => window.location.reload();

        socket.on('all-posts-fetched', reload);
        socket.on('likeUpdated', reload);
        socket.on('commentUpdated', reload);
        socket.on('userFollowed', reload);
        socket.on('userUnFollowed', reload);
        socket.on('stories-fetched', reload);
        socket.on('post-deleted', reload);

        return () => {
            socket.off('all-posts-fetched', reload);
            socket.off('likeUpdated', reload);
            socket.off('commentUpdated', reload);
            socket.off('userFollowed', reload);
            socket.off('userUnFollowed', reload);
            socket.off('stories-fetched', reload);
            socket.off('post-deleted', reload);
        };
    }, []);




  return (
    <GeneralContext.Provider value={{socket, isCreatPostOpen, setIsCreatePostOpen, isCreateStoryOpen, setIsCreateStoryOpen, isNotificationsOpen, setNotificationsOpen, notifications, setNotifications, chatFirends, setChatFriends, chatData:state, dispatch}}>{children}</GeneralContext.Provider>
  )
}
