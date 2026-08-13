import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import "./Notifications.css";
import bell from "../../../assets/images/bell.png";
import ringing from "../../../assets/images/ringing.png";

const Notifications = ({username} : {username: string}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const hasNotSeen = notifications.some(notification => !notification.seen);
  
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getNotifications();
  }, [username])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const getNotifications = () => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:3000/notifications/user/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setNotifications(res.data);
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  };

  const setSeen = (key: string) => {
    const token = localStorage.getItem('token');
    
    axios.post(
      `http://localhost:3000/notifications/${key}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setNotifications(prev => prev.map(n => n._key == key ? {...n, seen: true } : n));
    })
  }

  return (
    <div className="notifications">
      <div className="bell">
        <div 
          ref={ref}
          className={isFocused ? "open" : ""}
          onClick={() => setIsFocused((prev) => !prev)}
        >
          <img src={hasNotSeen ? ringing : bell} />
          
          {isFocused && (
            <p>Notifications</p>
          )}
        </div>
      </div>

      {isFocused && (
        <div className="list-notifications">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                className={notification.seen ? "" : "new"}
                key={notification._key}
                onClick={() => setSeen(notification._key)}
              >
                <p>{notification.message}</p>
              </div>
            )) 
          ) : (
            <p>No notifications.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
