import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./Rec.css";
import left_arrow from '../../../assets/images/left-arrow.png';
import right_arrow from '../../../assets/images/right-arrow.png';

const Rec = ({ recs, mess }: {recs: any, mess?: string}) => {
  const navigate = useNavigate();
  const [start, setStart] = useState(0);

  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isRightActive, setIsRightActive] = useState(false);

  const visible = recs.slice(start, start + 6);

  const handleLeftClick = () => {
    setIsLeftActive(true);
    setTimeout(() => {
      setStart(i => i - 1);
      setIsLeftActive(false);
    }, 400);
  }

  const handleRightClick = () => {
    setIsRightActive(true);
    setTimeout(() => {
      setStart(i => i + 1);
      setIsRightActive(false);
    }, 400);
  }

  return (
    <div className="recs">
      <div>
        {mess ? <p>{mess}</p> : <p>You might just like...</p>}
      </div>

      <div className="rec-wrapper">
        <div className="rec-buttons">
          {start > 0 && (
            <button 
              className={isLeftActive ? 'active' : ''} 
              onClick={handleLeftClick}
            >
              <img src={left_arrow} />
            </button>
          )}
        </div>

        <div className="rec-nav">
          {visible.map((rec: any) => {
            const recGenres = rec.Genre?.split(/,\s*/) ?? [];
            return (
              <div 
                key={rec._key}
                className="rec-card"
                onClick={() => navigate(`/movie/${rec._key}`)}
              >
                <img src={rec.Poster_Url} alt={rec.Title}/>
                <p id="rec-card-title-date"><b>{rec.Title}</b> ({rec.Release_Date?.split("-")[0]})</p>
                <p id="rec-card-genre">{recGenres[0]}</p>
              </div>
            );
          })}
        </div>

        <div className="rec-buttons">
          {start + 6 < recs.length && (
            <button 
              className={isRightActive ? 'active' : ''} 
              onClick={handleRightClick}
            >
              <img src={right_arrow} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Rec