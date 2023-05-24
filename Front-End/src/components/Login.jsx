import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { getUserDataFromToken } from '../utils/index';
import { client } from '../client';

const Login = () => {

  const navigate = useNavigate();

  const responseGoogle = async ({ credential }) => {
    try {
      localStorage.setItem('profile', credential);
      const { name, id, imageUrl } = getUserDataFromToken(credential);
      const doc = {
        _id: id,
        _type: 'user',
        userName: name,
        image: imageUrl,
      };
      client.createIfNotExists(doc)
        .then(() => {
          navigate('/', { replace: true });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const GLoginError = (error) => {
    console.error("Google Sign In was not successful. Try again later. Details: ", error);
  };

  return (
    <div>Login</div>
  )
}

export default Login