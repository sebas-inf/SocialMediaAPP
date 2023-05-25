import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {client} from '../client';
import {MasonryLayout} from './index';
import Spinner from './Spinner';
import { feedQuery, searchQuery } from '../utils/data';

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const[posts, setPosts] = useState(null)
  const {flareId} = useParams();

  useEffect(() => {
    setLoading(true);
    if (flareId) {
      const query = searchQuery(flareId);
      client.fetch(query)
        .then((data) => {
          setPosts(data);
          setLoading(false);
        });
    } else {
      const query = feedQuery();
      client.fetch(query)
        .then((data) => {
          setPosts(data);
          setLoading(false);
        });
    }
  }, [flareId]);
  

  if (loading) return <Spinner message= "We are adding new ideas to your feed!" />

  if (!pins?.length) return <h2 className='text-center'>No posts has this flare yet</h2>;
  
  return (
    <div>
      {posts && <MasonryLayout posts={posts}/>}
    </div>
  )
}

export default Feed