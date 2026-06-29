import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import "../Account/UserNav.css";

import UserReviews from './UserReviews/UserReviews';
import Library from './Library/Library';
import Edit from './Edit/Edit';

const UserNav = () => {
  const { username } = useParams();
  const [ user, setUser ] = useState<any>(null);
  const [ mode, setMode ] = useState("reviews");
  const navigate = useNavigate();

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

  const deleteAcc = () => {
    const yes = confirm("Are you sure you want to delete your account?");

    if (yes) {
      const token = localStorage.getItem('token');

      axios.delete(`http://localhost:3000/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        localStorage.removeItem('token'); 
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  return (
    <div className="usernav">
      <div className="usernav-navbar">
        <button
         className={mode === "reviews" ? "active" : ""}
         onClick={() => setMode("reviews")}
        >
            My reviews
        </button>
        <button 
          className={mode === "library" ? "active" : ""}
          onClick={() => setMode("library")}
        >
            Library
        </button>
        <button 
          className={mode === "edit" ? "active" : ""}
          onClick={() => setMode("edit")}
        >
            Edit profile
        </button>
        <button onClick={deleteAcc}>
          Delete account
        </button>
      </div> 
      <div className="page">
        {mode === "reviews" && <UserReviews username={username}/>}
        {mode === "library" && <Library username={username}/>}
        {mode === "edit" && <Edit user={user}/>}
      </div>
    </div>
  )
}

export default UserNav
