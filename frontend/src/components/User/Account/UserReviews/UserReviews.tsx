import { useEffect, useState } from 'react'
import axios from 'axios';
import "./UserReviews.css";
import Form from '../../../MovieTab/Reviews/Form/Form';

import user_pic from '../../../../assets/images/user.png';
import editIcon from "../../../../assets/images/edit.png";
import deleteIcon from "../../../../assets/images/delete.png";
import heart_fill from '../../../../assets/images/heart fill.png';

import { useNavigate } from 'react-router-dom';

const UserReviews = ({ username }: { username?: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [likesView, setLikesView] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:3000/reviews/user/${username}`)
        .then(res => res.json()) 
        .then(data => {
            if(data) setReviews(data);
        })   
        .catch(err => console.error(err));
  }, [username]);

  const getLikesByUsers = (key: string) => {
    console.log(key);
    const token = localStorage.getItem('token');
  
    axios.get(`http://localhost:3000/reviews/liked/${key}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setLikes(res.data);
        setLikesView(true);
      }
    })
    .catch(err => console.error(err));
  }

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

  if (!reviews || reviews.length === 0) return <p id="messageNoReviews">You have no reviews.</p>;

  return (
    <div className="userReviews">
      <div className="reviews-list">
        {reviews.map(r => (
          <div key={r._key} className="review-item">
            {editingReview?._key === r._key ? (
              <Form 
                username={username} 
                review={editingReview}
                onCancel={() => setEditingReview(null)}
              />
            ) : (
              <div className={`review ${!likesView ? 'active' : ''}`}>
                <div className="review-buttons">
                  <button id="edit" onClick={() => setEditingReview(r)}><img src={editIcon} /></button>
                  <button id="delete" onClick={() => deleteReview(r._key)}><img src={deleteIcon} /></button>
                </div>
                
                <div 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${r.movie_key}`)}
                >
                  <img src={r.poster} />
                </div>
                
                <div className="review-content">
                  <div className="movie-rating">
                    <span id="movie"><b>{r.movie}</b> ({r.date?.split("-")[0]})</span>
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
                    className={`heart_fill ${!r.Num_Likes ? 'disabled' : ''}`}
                    onClick={() => {
                      if (r.Num_Likes) {
                        getLikesByUsers(r._key);
                      }
                    }}
                  >
                    <button disabled={!r.Num_Likes}>
                      <img src={heart_fill} />
                    </button>
                    <p>{r.Num_Likes} {r.Num_Likes > 1 ? "likes" : "like"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div 
        className={`likes-overlay ${likesView ? 'active' : ''}`}
        onClick={() => setLikesView(false)}
      >
        <div 
          className="likes" 
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setLikesView(false)} >×</button>
          {likes.map((like) => (
            <div 
              className="likes-user" 
              key={like._key}
              onClick={() => navigate(`/${like.username}`)}
            >
              <img src={like?.image ? like.image : user_pic}/>
              <p>{like.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserReviews