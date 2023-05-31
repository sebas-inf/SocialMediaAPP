import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import {PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js"

import { userCreatedPostsQuery, userQuery, userLikedPostsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology';
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const ButtonWrapper = ({ type }) => {
	const [{ options }, dispatch] = usePayPalScriptReducer();

	useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                intent: "subscription",
            },
        });
    }, [type]);
    

	return (<PayPalButtons
		createSubscription={(data, actions) => {
			return actions.subscription
				.create({
					plan_id: "P-3RX065706M3469222L5IFM4I",
				})
				.then((orderId) => {
					// Your code here after create the order
					return orderId;
				});
		}}
		style={{
      layout:"horizontal",
			label: "subscribe",
      color: "white",
      shape: "pill",
      tagline: "false"
		}}
	/>);
}


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      });
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPostsQuery = userCreatedPostsQuery(userId);
      client.fetch(createdPostsQuery)
        .then((data) => {
          setPosts(data);
        });
    } else {
      const likedPostsQuery = userLikedPostsQuery(userId);
      client.fetch(likedPostsQuery)
        .then((data) => {
          setPosts(data);
        });
    }
  }, [text, userId]);

  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login');
  };

  if (!user) {
    return <Spinner message={'Loading profile...'} />;
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImage}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt="banner"
            />
            <img
              className='rounded-full w-40 h-40 -mt-20 shadow-xl object-cover'
              src={user?.image}
              alt="user-profile"
            />
            <h1 className='font-bold text-3xl text-center mt-3'>{user?.userName}</h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              { userId === user?._id ? (
                <button
                  type='button'
                  className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                  onClick={logout}
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              ) : null }
            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${(activeBtn === 'created') ? activeBtnStyles : notActiveBtnStyles }`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('liked');
              }}
              className={`${(activeBtn === 'liked') ? activeBtnStyles : notActiveBtnStyles }`}
            >
              Liked
            </button>
          </div>
          <div className='absolute right-5 top-12' style={{ maxWidth: "200px", minHeight: "200px" }} >
          <PayPalScriptProvider
            options={{
              "client-id": "test",
              components: "buttons",
              intent: "subscription",
              vault: true,
            }}
          >
            <ButtonWrapper type="subscription" />
          </PayPalScriptProvider>
          </div>
          { posts?.length ? (
            <div className='px-2'>
              <MasonryLayout posts={posts} />
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Posts Found!
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
