import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import Nav from './Nav';

const SearchBar = () => {
  const [name, setName] = useState("");
  const [decade, setDecade] = useState("");
  const [rating, setRating] = useState("");
  const genres = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "Western"];
  const [genre, setGenre] = useState("");
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

  useEffect(() => {
    handleSearchByChoice();
  }, [decade, rating, genre])

  const handleSearchByChoice = async () => {
    const params = new URLSearchParams

    if (decade) params.append("decade", decade);
    if (rating) params.append("rating", rating);
    if (genre) params.append("genre", genre);

    const res = await fetch(`http://localhost:3000/movies/search?${params.toString()}`)
    const data = await res.json();
    setResults(data);
  }

  return (
    <div id="search-page">
      <Nav />
      <div id="search-group">
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

        <div className="filters">
          <select id="decade"
            value={decade}
            onChange={(e) => setDecade(e.target.value)}
          >
            <option value="" disabled hidden>Godina</option>
            <option 
              value="Novi"
            >
              Novi
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
            <option value="" disabled hidden>Ocjena</option>
            <option 
              value="Najvisočiji"
            >
              Najvisočiji
            </option>
            <option 
              value="Najniži"
            >
              Najniži
            </option>
          </select>

          <select id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="" disabled hidden>Žanr</option>
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
