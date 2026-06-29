import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Nav.css";
import search from "../../assets/images/search.png"

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState("");
  const [results, setResults] = useState<any[]>([]);

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

  const fetchMovies = async (title: string) => {
    const res = await fetch(`http://localhost:3000/movies/search/?title=${title}`)
    const data = await res.json();
    setResults(data);
  }

  const handleSearchClick = () => {
    fetchMovies(name);
  }

  const logout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);

    navigate('/');
  };

  return (
    <div className="navBar">
      <div className="navBar-items">
        <div className="logo">
          <a href="/"><b>MovieHub</b></a>
        </div>

        <div className="pages">
          <a href="/">Home</a>
          <a href="/search">Search movies</a>
          <a>Add users</a>
        </div>
      </div>

      <div className="navBar-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <img src={search} />
        </div>

        <div className="user">
          {isLoggedIn ? (
            <div className="userLoggedIn">
              <a href="#" onClick={logout}>Sign out</a>
              <a onClick={() => navigate(`/user/${username}`)}>Your account</a>
            </div>
          ) : (
            <div className="userNotLoggedIn">
              <a href="/login">Sign in</a>
              <a href="/register">Create an account</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Nav
