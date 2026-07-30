import React, { useEffect, useState } from 'react'
import "./Likes.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import user_pic from '../../../../assets/images/user.png';

const Likes = ({reviewKey, onClose}: {reviewKey: string; onClose: () => void}) => {
  const [likes, setLikes] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    axios.get(`http://localhost:3000/reviews/liked/${reviewKey}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setLikes(res.data);
      }
    })
    .catch(err => console.error(err));
  }, [reviewKey])

  return (
    <div >
      <div 
        className="likes" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}>×</button>
        {likes.map((user) => (
          <div 
            className="likes-user" 
            key={user._key}
            onClick={() => {
              onClose(),
              navigate(`/user/${user.username}`)
            }}
          >
            <img src={user?.image ? `http://localhost:3000${user.image}` : user_pic}/>
            <p>{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Likes
