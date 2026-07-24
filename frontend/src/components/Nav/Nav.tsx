import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Nav.css";
import search from "../../assets/images/search.png"
import Notifications from './Notifications/Notifications';

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const [isFocused, setIsFocused] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsFocused(false);
        setName("");
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

  const fetchMovies = async (title: string) => {
    const res = await fetch(`http://localhost:3000/movies/search/?title=${title}`)
    const data = await res.json();
    setResults(data);
  }

  const handleQueryChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    fetchMovies(name);
  }

  const logout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);

    navigate('/login');
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
        <div 
          className="search-box" 
          ref={ref}
        >
          <div className="search-box-input">
            <input
              className={name ? "open_name" : isFocused ? "open" : ""}
              type="text"
              placeholder="Search movies..."
              value={name}
              onChange={handleQueryChange}
            />
            <img 
              src={search} 
              onClick={() => {
                if (isFocused) {
                  setIsFocused(false);
                  setName("");
                  setResults([]);
                } else {
                  setIsFocused(true);
                }
              }}
            />
          </div>
          
          {isFocused && name != "" && (
            <div className="search-box-res">
              {results.length > 0 ? (
                results.map(res => (
                  <div 
                    key={res._key}
                    onClick={() => navigate(`/movie/${res._key}`)}
                  >
                    <p>{res.Title} ({res.Release_Date?.split("-")[0]})</p>
                  </div>
                ))
              ) : (
                <p>No results.</p>
              )}
            </div>
          )}
        </div>

        <div className="user">
          {isLoggedIn ? (
            <div className="userLoggedIn">
              <div className="user-notifications">
                <Notifications username={username} />
              </div>
              <a onClick={logout}>Sign out</a>
              <a onClick={() => navigate(`/${username}`)}>Your account</a>
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
