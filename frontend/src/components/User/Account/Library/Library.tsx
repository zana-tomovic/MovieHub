import React, { useEffect, useState } from 'react'
import "../Library/Library.css";
import axios, { all } from 'axios';
import { useNavigate } from 'react-router-dom';

const Library = ({ username }: { username?: string }) => {
    const [ movies, setMovies ] = useState<any>([]);
    const [ saved, setSaved ] = useState<any>([]);
    const [ seen, setSeen ] = useState<any>([]);
    const [ activeFilter, setActiveFilter ] = useState('all')

    const navigate = useNavigate();

    useEffect(() => {
        if (username) {
            getAll()
        }
    }, [username])

    const getAll = () => {
      const token = localStorage.getItem('token');

      axios.get(
        `http://localhost:3000/movies/user/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        setMovies(res.data);
        setActiveFilter('all');
        console.log(res.data);
      })
      .catch(err => console.error(err));
    }

    const getSaved = () => {
      const token = localStorage.getItem('token');

      axios.get(
        `http://localhost:3000/movies/saved/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        setSaved(res.data);
        setActiveFilter('saved');
      })
      .catch(err => console.error(err));
    }

    const getSeen = () => {
        const token = localStorage.getItem('token');

        axios.get(
            `http://localhost:3000/movies/seen/${username}`,
            {
                headers: {
                Authorization: `Bearer ${token}`
                }
            }
        )
        .then((res) => {  
            setSeen(res.data);
            setActiveFilter('seen');
        })
        .catch(err => console.error(err));
    }

    const getAtoZ = () => {
      setActiveFilter("all");
      setMovies(prev => [...prev].sort((a, b) => a.Title.localeCompare(b.Title)));
    
      return movies;
    }

    const getZtoA = () => {
      setActiveFilter("all");
      setMovies(prev => [...prev].sort((a, b) => b.Title.localeCompare(a.Title)));

      return movies;
    }

    const getActiveList = () => {
      if (activeFilter === "saved") return saved;
      if (activeFilter === "seen") return seen;
      
      return movies;
    }

    return (
    <div className="library-page">
      <div className="filters">
        <button id="aToZ" onClick={getAtoZ}> 
          A-Z
        </button>
        <button id="zToA" onClick={getZtoA}>
          Z-A
        </button>
        <button id="seen" onClick={getSeen}>
          Watched
        </button>
        <button id="saved" onClick={getSaved}>
          Not watched
        </button>
      </div>
      <div id="library-grid">
        {getActiveList().map((movie: any) => (
          <div 
            key = {movie._key}
            className="movie-card"
            onClick={() => navigate(`/movie/${movie._key}`)}
          >
            <img src={movie.Poster_Url} alt={movie.Title} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Library
