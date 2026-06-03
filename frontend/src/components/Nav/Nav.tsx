import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Nav.css";

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  let navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get(`http://localhost:3000/auth/loggedUser`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setUsername(res.data.username);
        setIsLoggedIn(true);
      }
    })
    .catch((error) => {
      console.log(error.message);
      setIsLoggedIn(false);
    });
  }, []);

  const logout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);

    navigate('/');
  };

  return (
    <div className="navBar">
      <div className="navbar-items">
        <div className="logo">
          <a href="/"><b>MovieHub</b></a>
        </div>

        <div className="pages">
          <a href="/">Home</a>
          <a href="/search">Search movies</a>
        </div>
      </div>

      <div className="user">
        { isLoggedIn ? (
          <div className="userLoggedIn">
            <a href="#" onClick={logout}>Sign out</a>
            <a href="" onClick={() => navigate(`/user/${username}`)}>Your account</a>
          </div>
        ) : (
          <div className="userNotLoggedIn">
            <a href="/login">Sign in</a>
            <a href="/register">Create an account</a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Nav
