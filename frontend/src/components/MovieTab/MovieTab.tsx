import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./MovieTab.css";
import Nav from '../Nav';
import Reviews from './Reviews/Reviews';

const MovieTab = () => {
  const { id } = useParams();
  const [ movie, setMovie ] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setMovie(data);
        }
      })
      .catch(err => console.error(err));
  }, [ id ]);

  if (!movie) return <div id="loading">Učitavanje...</div>;

  const releaseYear = movie.Release_Date?.split(/-\s*/)[0] ?? "";
  const genres = movie.Genre?.split(/,\s*/) ?? [];

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
            <p><b>{releaseYear}</b></p>
            <p id="dot"><b>•</b></p>
            <p><b>★  {movie.Vote_Average}</b></p> 
          </div>

          <p className="overview">{movie.Overview}</p>
          <ul className="genre-list">
            {genres.map((g, index) => (
              <li key={index}> {g} </li>
            ))}
          </ul>
        </div>
          
      </div>
      <Reviews movieId={id} /> 
    </div>
  )
}

export default MovieTab
