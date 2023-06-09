import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill, RiInboxFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import logo from '../assets/logo.png';
import { flares } from '../utils/data';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) {
      closeToggle(false);
    }
  };

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
        >

          <img src={logo} alt='logo' className='w-full' />

        </Link>

        <div className='flex flex-col gap-5'>

          <NavLink
            to='/'
            className={({ isActive }) => ((isActive) ? isActiveStyle : isNotActiveStyle) }
            onClick={handleCloseSidebar}
            end
          >

            <RiHomeFill /> Home
          </NavLink>
          <NavLink
            to='/direct-messaging'
            className={({ isActive }) => ((isActive) ? isActiveStyle : isNotActiveStyle) }
            onClick={handleCloseSidebar}
            end
          >
            <RiInboxFill/> Inbox
          </NavLink>

          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover Flares</h3>
          { flares.slice(0, flares.length - 1).map((flare) => (
            <NavLink
              to={`/flare/${flare.name}`}
              className={({ isActive }) => ((isActive) ? isActiveStyle : isNotActiveStyle) }
              onClick={handleCloseSidebar}
              key={flare.name}
            >
              <img src={flare.image} className="w-8 h-8 rounded-full shadow-sm" alt={flare.name} />
              { flare.name }
            </NavLink>
          )) }

        </div>
      </div>
      { user ? (
        <Link
          to={`user-profile/${user._id}`}
          className='flex my-5 mb-3 gap-2 p-2 items-center bg-black text-white rounded-lg shadow-lg mx-3' //Stylization of user box in sidebar
          onClick={handleCloseSidebar}
        >
          <img src={user.image} className='w-10 h-10 rounded-full' alt='user-profile' />
          <p>{user.userName}</p>
          <IoIosArrowForward />
        </Link>
      ) : null }
    </div>
  );
};

export default Sidebar;