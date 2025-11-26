import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthenticationContext = createContext();

const AuthenticationContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const profilePic = 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80';


  const inputs = {username: username, email: email, password: password, profilePic: profilePic};


  const navigate = useNavigate();

  const [error, setError] = useState('');
  
  const API_URL = process.env.REACT_APP_API_URL || '';

  const login = async () =>{
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const loginInputs = {email: email, password: password}
      const res = await axios.post(`${API_URL}/login`, loginInputs);
      
      if (res.data.token && res.data.user) {
        console.log("Login successful:", res.data);
        localStorage.setItem('userToken', res.data.token);
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('email', res.data.user.email);
        localStorage.setItem('profilePic', res.data.user.profilePic);
        localStorage.setItem('posts', res.data.user.posts || []);
        localStorage.setItem('followers', res.data.user.followers || []);
        localStorage.setItem('following', res.data.user.following || []);
        navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  }

  const register = async () =>{

    try{
      const url = `${API_URL}/register`;
      console.log('Attempting register POST to:', url);
      console.log('Register payload:', inputs);

      const res = await axios.post(url, inputs, { headers: { 'Content-Type': 'application/json' } });

      if (res && res.data) {
        localStorage.setItem('userToken', res.data.token);
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('email', res.data.user.email);
        localStorage.setItem('profilePic', res.data.user.profilePic);
        localStorage.setItem('posts', res.data.user.posts);
        localStorage.setItem('followers', res.data.user.followers);
        localStorage.setItem('following', res.data.user.following);  
        navigate('/');
      } else {
        console.error('Register: unexpected response', res);
      }

    }catch(err){
        console.error('Register error:', err.response ? err.response.data : err.message || err);
        if (err.response && err.response.data && err.response.data.msg) {
          setError(err.response.data.msg);
        } else {
          setError('Registration failed. Please try again.');
        }
    }
  }



  const logout = async () =>{
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/landing');
  }



  return (
    <AuthenticationContext.Provider value={{login, register, logout, username, setUsername, email, setEmail, password, setPassword }} >{children}</AuthenticationContext.Provider>
  )
}

export default AuthenticationContextProvider