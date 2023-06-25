import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ChatEngine } from 'react-chat-engine';
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
    }, []);
  
    const getFile = async (url) => {
      const response = await fetch(url);
      const data = await response.blob();
  
      return new File([data], user?.imageUrl, { type: "image/jpeg" });
    };
  
    

    useEffect(() => {

      if(!user || user === null){
        history("/")

        return
      }

      axios.get( 
          'https://api.chatengine.io/users/me/', 
          { headers: {
              "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
              "user-name": user?.email,
              "user-secret": user?._id
          }}
      
      )
      .then(() => {setLoading(false);

      })
      .catch(e => {
          let formdata = new FormData()
          formdata.append("email", user?.email)
          formdata.append("username", user?.name)
          formdata.append("secret", user?.id)

          getFile(user?.image)
              .then((avatar) => {
                  formdata.append("avatar", avatar, avatar.name)

                  axios.post(
                      "https://api.chatengine.io/users",
                      formdata,
                      {headers: {"private-key": process.env.REACT_APP_CHAT_ENGINE_KEY}}
                  )

                  .then(() => setLoading(false))
                  .catch(e => console.log("e", e.response))
              })
      })

    }, [user, history]);

    if (!user || loading) return
  
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
        
          <ChatEngine 
                height="calc(100vh - 66px)"
                width = ""
                projectID= {process.env.REACT_APP_CHAT_ENGINE_ID}
                userName={user?.name}
                userSecret={user?.email}
            />
        
        
      </div>
    );
  };

export default DM