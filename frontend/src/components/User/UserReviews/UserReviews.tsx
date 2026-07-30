import { useEffect, useState } from 'react'
import axios from 'axios';
import "./UserReviews.css";
import Form from '../../MovieTab/Reviews/Form/Form';

import editIcon from "../../../assets/images/edit.png";
import deleteIcon from "../../../assets/images/delete.png";
import heart from '../../../assets/images/heart.png';

import { useNavigate } from 'react-router-dom';
import Likes from './Likes/Likes';

const UserReviews = ({ username, isLoggedIn }: { username?: string; isLoggedIn?: boolean }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [openLikesFor, setOpenLikesFor] = useState<string | null>(null);

  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:3000/reviews/user/${username}`)
        .then(res => res.json()) 
        .then(data => {
            if(data) setReviews(data);
        })   
        .catch(err => console.error(err));
  }, [username]);

  const deleteReview = (key: string) => {
    const token = localStorage.getItem('token');
    
    axios.delete(`http://localhost:3000/reviews/${key}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setReviews(prev => prev.filter(r => r._key !== key));
    })
    .catch(err => console.error(err));
  }

  if (!reviews || reviews.length === 0) return <p id="messageNoReviews">{isLoggedIn ? "You have no reviews." : "No reviews."}</p>;

  return (
    <div className="userReviews">
      <div className="reviews-list">
        {reviews.map(r => (
          <div key={r._key} className="review-item">
            {editingReview?._key === r._key ? (
              <Form 
                username={username} 
                review={editingReview}
                onClose={() => setEditingReview(null)}
              />
            ) : (
              <div className={"review"}>
                {isLoggedIn && (
                  <div className="review-buttons">
                    <button id="edit" onClick={() => setEditingReview(r)}><img src={editIcon} /></button>
                    <button id="delete" onClick={() => deleteReview(r._key)}><img src={deleteIcon} /></button>
                  </div>
                )}
                
                <div 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${r.movie_key}`)}
                >
                  <img src={r.poster} />
                </div>
                
                <div className="review-content">
                  <div className="movie-rating">
                    <span id="movie" onClick={() => navigate(`/movie/${r.movie_key}`)}><b>{r.movie}</b> ({r.date?.split("-")[0]})</span>
                    <span className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= r.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </span>
                  </div>
                  <p id="comment">{r.comment ? r.comment : ''}</p>

                  <div 
                    className={`heart ${!r.Num_Likes ? 'disabled' : ''}`}
                    onClick={() => {
                      if (r.Num_Likes) {
                        setOpenLikesFor(r._key);
                      }
                    }}
                  >
                    <button disabled={!r.Num_Likes}>
                      <img src={heart} />
                    </button>
                    <p>{r.Num_Likes} {r.Num_Likes > 1 ? "likes" : "like"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {openLikesFor && (
        <div 
          className="likes-overlay active"
          onClick={() => setOpenLikesFor(null)}
        >
          <Likes reviewKey={openLikesFor} onClose={() => setOpenLikesFor(null)}/>
        </div>
      )}
    </div>
  )
}

export default UserReviews