import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./UserFollower.css";
import user_pic from '../../../assets/images/user.png';
import axios from 'axios';

const UserFollower = (
  {isLogged, followersMode, loggedUserId, userId, onClose}: 
  {isLogged: boolean; followersMode: boolean; loggedUserId: string; userId: string; onClose: () => void}) => {

  const [followers, setFollowers] = useState<any[]>([]);
  const [followed, setFollowed] = useState<any[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    getFollowers();
    getFollowed();
  }, [userId])

  const getFollowers = () => {
    const token = localStorage.getItem('token');
      
    axios.get(`http://localhost:3000/followers`, {
      params: {
        id: userId
      },
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    })
    .then((res) => {
        if (res.data) {
          setFollowers(res.data);
          console.log(res.data);
        }
    })
    .catch(err => console.error(err));
  }

  const getFollowed = () => {
    const token = localStorage.getItem('token');
        
    axios.get(`http://localhost:3000/followers/followed`, {
        params: {
          id: userId
        },
        headers: { 
          Authorization: `Bearer ${token}` 
        }
    })
    .then((res) => {
        if (res.data) {
          setFollowed(res.data);
          setFollowedIds(new Set(res.data.map((f: any) => f._id)));
        }
    })
    .catch(err => console.error(err));
  }

  const followUser = (followedId: string) => {
    const token = localStorage.getItem('token');    

    axios.post(`http://localhost:3000/followers`, 
      {
        followerId: loggedUserId,
        followedId: followedId 
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
        if (res.data) {
          setFollowedIds(prev => new Set(prev).add(followedId));
        }
    })
    .catch(err => console.error(err));
  }

  const unfollowUser = (followedId: string) => {
    const token = localStorage.getItem('token');    

    axios.delete(
      `http://localhost:3000/followers`, 
      {
        data: {
          followerId: loggedUserId,
          followedId: followedId
        }, 
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
      if (res.data) {
        setFollowedIds(prev => {
          const next = new Set(prev);
          next.delete(followedId);
          return next;
        });
      }
    })
    .catch(err => console.error(err));
  }

  const removeUser = (followerId: string) => {
    const token = localStorage.getItem('token');    

    axios.delete(
      `http://localhost:3000/followers`, 
      {
        data: {
          followerId: followerId,
          followedId: loggedUserId
        }, 
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
      if (res.data) {

      }
    })
    .catch(err => console.error(err));
  }

  return (
    <div>
      <div 
        className="followers" 
        onClick={(e) => e.stopPropagation()}
      >
        <button id="exit" onClick={onClose}>×</button>
        {(followersMode ? followers : followed).map((user) => (
        <div 
            className="follower" 
            key={user._key}
        >
          <div
            className="follower-details" 
            onClick={() => {
              onClose(),
              navigate(`/user/${user.username}`)
            }}
          >
            <img src={user?.image ? `http://localhost:3000${user.image}` : user_pic}/>
            <p>{user.username}</p>
          </div>
            <div className={`follower-buttons ${user._id == loggedUserId ? 'same-user-id' : ''}`}>
              {followersMode ? (
                  <>  
                      <button onClick={() => followedIds.has(user._id) ? unfollowUser(user._id) : followUser(user._id)}>
                        {followedIds.has(user._id) ? "Unfollow" : "Follow"}
                      </button>
                      {isLogged && (
                        <button onClick={() => removeUser(user._id)}>Remove</button>
                      )}
                  </>
              ) : (
                <button onClick={() => followedIds.has(user._id) ? unfollowUser(user._id) : followUser(user._id)}>
                  {followedIds.has(user._id) ? "Unfollow" : "Follow"}
                </button>            
              )}
            </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default UserFollower
