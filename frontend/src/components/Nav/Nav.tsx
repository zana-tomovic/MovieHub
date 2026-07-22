import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Nav.css";
import search from "../../assets/images/search.png"

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const [isFocused, setIsFocused] = useState(false);

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

  const handleQueryChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
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
          <div className="search-box-input">
            <input
              className={isFocused && name !== "" ? "open" : ""}
              type="text"
              placeholder="Search movies..."
              value={name}
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              onMouseEnter={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <img src={search} />
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
              <a href="#" onClick={logout}>Sign out</a>
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
