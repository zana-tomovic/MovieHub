import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const View = () => {
  const username = useParams()
  const [ user, setUser ] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get(`http://localhost:3000/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setUser(res.data);
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }, [username]);

  return (
    <div>
      <span>Hello</span>
    </div>
  )
}

export default View
