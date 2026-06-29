import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './MoviesSearch.css';
import Nav from '../Nav/Nav';

const MoviesSearch = () => {
  const [decade, setDecade] = useState("");
  const [rating, setRating] = useState("");
  const genres = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "Western"];
  const [genre, setGenre] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    handleSearchByChoice();
  }, [results])

  const handleSearchByChoice = async () => {
    const params = new URLSearchParams

    if (decade) params.append("decade", decade);
    if (rating) params.append("rating", rating);
    if (genre) params.append("genre", genre);

    const res = await fetch(`http://localhost:3000/movies/filter/?${params.toString()}`)
    const data = await res.json();
    setResults(data);
  }

  return (
    <div id="search-page">
      <Nav />
      <div id="search-group">        
        <div className="filters">
          <select id="decade"
            value={decade}
            onChange={(e) => setDecade(e.target.value)}
          >
            <option value="" disabled hidden>Year</option>
            <option 
              value="New"
            >
              New
            </option>
            <option
              value="2020s"
            >
              2020s
            </option>
            <option
              value="2010s"
            >
              2010s
            </option>
            <option
              value="2000s"
            >
              2000s
            </option>
          </select>

          <select id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}        
            >
            <option value="" disabled hidden>Rating</option>
            <option 
              value="Highest"
            >
              Highest
            </option>
            <option 
              value="Lowest"
            >
              Lowest
            </option>
          </select>

          <select id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="" disabled hidden>Genre</option>
            {genres.map((g) => (
              <option 
                key={g} 
                value={g}
              >
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div id="movie-grid">
        {results.map((movie: any) => {
          const movieGenres = movie.Genre?.split(/,\s*/) ?? [];
          return (
            <div
              key={movie._key}
              className="movie-card"
              onClick={() => navigate(`/movie/${movie._key}`)}
            >
              <img src={movie.Poster_Url} alt={movie.Title}/>
              <p id="movie-card-title">{movie.Title}</p>
              <p id="movie-card-genre">{movieGenres[0]}</p>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default MoviesSearch
