import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import axios from "axios";
import { client } from '../client';
import logo from '../assets/logo.png';
import { getUserDataFromToken } from '../utils/index';
import { userQuery } from '../utils/data';

const DM = () => {

    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [user, setUser] = useState(null);
    const scrollRef = useRef(null);
    const history = useNavigate();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const userInfo = getUserDataFromToken();
      if (userInfo) {
        const query = userQuery(userInfo.id);
        client.fetch(query).then((data) => {
          setUser(data[0]);
        });
      }
      return () => {
        setUser(null);
      };
    }, []);
  
    const getFile = async (url) => {
      const response = await fetch(url);
      const data = await response.blob();
  
      return new File([data], user?.image, { type: "image/jpeg" });
    };
  
    useEffect(() => {
      
      const loadData = async () => {
        try {
          let res = await axios.get("https://api.chatengine.io/users/me", {
            headers: {
              "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
              "user-name": user?.userName,
            },
          });
          setLoading(false);
          console.log("Response", res);
        } catch (error) {
          let formdata = new FormData();
          formdata.append("username", user?.userName);
  
          await getFile(user?.image).then(async (avatar) => {
            formdata.append("avatar", avatar, avatar.name);
  
            await axios
              .post("https://api.chatengine.io/users", formdata, {
                headers: {
                  "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY,
                },
              })
              .then(() => {
                setLoading(false);
                console.log("success here");
              })
              .catch((error) => console.log(error));
          });
          console.log(error);
        }
      };
  
      loadData();
    }, [user, history]);
  
    
  
    return (
      <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
        <div className='hidden md:flex h-screen'>
          <Sidebar user={ user } />
        </div>
        <div className='flex md:hidden flex-row'>
          <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
  
            <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
  
            <Link to='/'>
              <img src={logo} alt='logo' className='w-28' />
            </Link>
  
            <Link to={`user-profile/${user?._id}`}>
              <img src={user?.image} alt='logo' className='w-28' />
            </Link>
  
          </div>
          { toggleSidebar ? (
            <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
              <div className='absolute w-full flex justify-end items-center p-2'>
  
                <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
  
              </div>
  
              <Sidebar user={ user } closeToggle={ setToggleSidebar } />
  
            </div>
          ) : null }
        </div>
        <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={ scrollRef }>
  
          <Routes>
            <Route path="/user-profile/:userId" element={ <UserProfile /> } />
          </Routes>
  
        </div>
        <div>
          <ChatEngine
          height="calc(100vh - 66px)"
          projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
          userName={user?.userName}
          />
        </div>
        
      </div>
    );
  };

export default DM