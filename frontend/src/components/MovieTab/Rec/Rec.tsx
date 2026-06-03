import { useNavigate } from 'react-router-dom';
import "./Rec.css";

const Rec = ({ recs, mess }: {recs: any, mess?: string}) => {
  const navigate = useNavigate();
  
  return (
    <div className="recs">
      <div>
        {mess ? (
          <p>{mess}</p>
        ): (
          <p>You might just like...</p>
        )}
      </div>
      <div className="rec-nav">
        
        {recs.map((rec:any) => (
          <div 
            key={rec._key}
            className="rec-card"
            onClick={() => navigate(`/movie/${rec._key}`)}
          >
            <img src={rec.Poster_Url} alt={rec.Title}/>
          </div>
        ))}
        
      </div>
    </div>
  )
}

export default Rec
