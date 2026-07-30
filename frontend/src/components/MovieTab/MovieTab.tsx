import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./MovieTab.css";
import Nav from '../Nav/Nav';
import Reviews from './Reviews/Reviews';
import axios from 'axios';
import Rec from './Rec/Rec';
import SaveButton from './SaveButton';
import Form from './Reviews/Form/Form';

const MovieTab = () => {
  const { key } = useParams();
  const [ username, setUsername ] = useState('');
  const [ movie, setMovie ] = useState<any>(null);
  const [ recs, setRecs ] = useState<any>([]);

  useEffect(() => {
      getMovie();
      getRecs();
  }, [ key ]);

  useEffect(() => {
      getUser();
  }, [])

  const getMovie = () => {
      fetch(`http://localhost:3000/movies/${key}`)
        .then(res => res.json())
        .then(data => {
            if (data) setMovie(data);
        })
        .catch(err => console.error(err));
  }

  const getUser = () => {
    const token = localStorage.getItem('token');
    
    axios.get(`http://localhost:3000/auth/loggedUser`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setUsername(res.data.username);
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  const getRecs = () => {
    fetch(`http://localhost:3000/movies/recs/key/${key}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
            setRecs(data);
        }
      })
      .catch(err => console.error(err));
  };

  if (!movie) return <div id="loading">Loading...</div>;

  const releaseYear = movie.Release_Date?.split(/-\s*/)[0] ?? "";
  const genres = movie.Genre?.split(/,\s*/) ?? [];
  const actors = movie.Actors?.split(/,\s*/) ?? [];

  return (
    <div className="movie-tab">
      <div className="hero">
        <Nav />
        <div className="movie-image">
          <img src={movie.Poster_Url2} alt={movie.Title}/>  
        </div>

        <div className="movie-details">
          <p id="title"><b>{movie.Title}</b></p>

          <div className="movie-vote-date">
            <p><b>{movie.Duration} minutes</b></p>
            <p><b>{releaseYear}</b></p>
            <p><b>★  {movie.Vote_Average}</b></p> 
          </div>

          <p id="overview">{movie.Overview}</p>
          <div className="genres">
            <p> <b>Genres </b> </p>
            <ul className="genre-list">
              {genres.map((g, index) => (
                <li key={index}> {g} </li>
              ))}
            </ul>
          </div>

          <div className="actors">
            <p> <b>Actors </b> </p>
            <ul className="actors-list">
              {actors.map((g, index) => (
                <li key={index}> {g} </li>
              ))}
            </ul>
          </div>
          <SaveButton movieKey={key} username={username}/>
        </div>
      </div>
      <div className="movie-reviews">
        <Reviews movieKey={key} username={username}/> 
        <Form movieKey={key} username={username}/>
      </div>

      <div className="movie-tab-rec">
        <Rec recs={recs}/>   
      </div>       
    </div>
  )
}

export default MovieTab
