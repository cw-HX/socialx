import React, { useContext, useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { GeneralContext } from '../../context/GeneralContextProvider'
import {v4 as uuid} from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';
import axios from 'axios';

const Input = () => {

    const {socket, chatData} = useContext(GeneralContext);

    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    const [uploadProgress, setUploadProgress] = useState();

    const userId = localStorage.getItem('userId');


    const handleSend = async () => {
      if (!chatData.chatId || (!text.trim() && !file)) {
        return;
      }

      try {
        let fileUrl = null;
        if (file) {
          const storageRef = ref(storage, uuid());
          const uploadTask = uploadBytesResumable(storageRef, file);

          await new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
              (snapshot) => {
                setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              },
              (error) => {
                console.error('Upload error:', error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                fileUrl = downloadURL;
                resolve();
              }
            );
          });
        }

        const messageData = {
          chatId: chatData.chatId,
          id: uuid(),
          text: text.trim(),
          file: fileUrl,
          senderId: userId,
          date: new Date(),
          senderName: localStorage.getItem('username'),
          senderPic: localStorage.getItem('profilePic')
        };

        await socket.emit('new-message', messageData);
        setUploadProgress(undefined);
        setText('');
        setFile(null);
      } catch (err) {
        console.error('Send message error:', err);
        setUploadProgress(undefined);
      }

    }

  return (
    <div className='input' >
      <input type="text" placeholder='type something...' onChange={e => setText(e.target.value)} value={text} />
      <div className="send">
        <input type="file" style={{display : 'none'}} id='file' onChange={e=> setFile(e.target.files[0])} />
        <label htmlFor="file" style={{display:'flex'}}>
          <BiImageAdd />
          <p style={{fontSize: '12px'}}>{uploadProgress ? Math.floor(uploadProgress) + '%' : ''}</p>
                </label>
                {file && uploadProgress ?
                    <button disabled>Sending... {Math.round(uploadProgress)}%</button>
                    :
                    <button onClick={handleSend}>Send</button>
                }
            </div>
        </div>
    );
};

export default Input;