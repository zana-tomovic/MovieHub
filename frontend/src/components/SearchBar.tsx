import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import Nav from './Nav';

const SearchBar = () => {
  const [name, setName] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const fetchMovies = async (title: string) => {
    const res = await fetch(`http://localhost:3000/movies?title=${title}`)
    const data = await res.json();
    setResults(data);
  }

  const handleSearchClick = () => {
    fetchMovies(name);
  }

  return (
    <div id="search-page">
      <Nav />
      <div id="search-input-group">
        <input 
            id="search-input"
            type="text"
            placeholder="Pretraži filmove..."
            value={name}
            onChange={(e) => setName(e.target.value)} >
        </input>
        <button id="search-button" onClick={handleSearchClick}>
            Search
        </button> 
      </div>

      <div id="movie-grid">
        {results.map((movie: any) => (
            <div
              key={movie._key}
              className="movie-card"
              onClick={() => navigate(`/movie/${movie._key}`)}
            >
              <img src={movie.Poster_Url} alt={movie.Title}/>
            </div>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
