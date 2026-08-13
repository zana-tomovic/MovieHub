import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Slideshow.css";

const SlideShow = ({ newMov, interval = 20000 }: { newMov: any[]; interval?: number}) => {
  const [ curr, setCurr ] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurr(prev => (prev + 1) % newMov.length);
    }, interval);

    return () => clearInterval(timer);
  }, [newMov.length, interval]);

  // const prev = () => setCurr(prev => (prev - 1 + newMov.length) % newMov.length);
  // const next = () => setCurr(prev => (prev + 1 + newMov.length) % newMov.length);

  if (!newMov.length) return null;

  return (
    <div className="slideshow">
      <div 
        key={newMov[curr]._key}
        onClick={() => navigate(`/movie/${newMov[curr]._key}`)}
      >
        <img src={newMov[curr].Poster_Url2} />
      </div>
      
      <div className="details">
        <p id="movie-title"><b>{newMov[curr].Title}</b></p>
        <p id="movie-overview">{newMov[curr].Overview}</p>
      </div>

      <div className="slide-dots">
        {newMov.map((_, i) => (
          <span 
            key={i}
            className={`dot ${i === curr ? 'active' : ''}`}
            onClick={() => setCurr(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default SlideShow
