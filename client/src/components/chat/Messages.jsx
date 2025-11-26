import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Messages = () => {

  const {socket} = useContext(GeneralContext)
  const [messages, setMessages] = useState([]);

  const {chatData} = useContext(GeneralContext);
  

  useEffect(() => {
    if (!chatData.chatId) return;

    const handleMessagesUpdated = ({ chat }) => {
      if (chat && chat.messages) {
        setMessages(chat.messages);
      }
    };
  
    const handleNewMessage = async () => {
      if (chatData.chatId) {
        socket.emit('update-messages', { chatId: chatData.chatId });
      }
    };

    // Initial messages load
    socket.emit('fetch-messages', { chatId: chatData.chatId });
  
    // Listen for real-time updates
    socket.on('messages-updated', handleMessagesUpdated);
    socket.on('message-from-user', handleNewMessage);
  
    return () => {
      socket.off('messages-updated', handleMessagesUpdated);
      socket.off('message-from-user', handleNewMessage);
    };
  }, [socket, chatData.chatId])

  return (
    <div className='messages' >
      
      {messages.length > 0 &&  messages.map((message)=>(

        <Message message={message} key={message.id} />
      ))
      }

</div>
  )
}

export default Messages