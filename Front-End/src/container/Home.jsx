import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components/index';
import Pins from './Pins';
import { client } from '../client';
import logo from '../assets/logo.png';
import { getUserDataFromToken } from '../utils/index';
import { userQuery } from '../utils/data';

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home