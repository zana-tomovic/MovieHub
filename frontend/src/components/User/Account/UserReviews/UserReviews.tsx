import React, { useEffect, useState } from 'react'
import axios from 'axios';

import editIcon from "../../../../assets/images/edit.png";
import deleteIcon from "../../../../assets/images/delete.png";
import "./UserReviews.css";
import Form from '../../../MovieTab/Reviews/Form/Form';

const UserReviews = ({ username }: { username?: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/reviews/user/${username}`)
        .then(res => res.json()) 
        .then(data => {
            if(data) setReviews(data);
        })   
        .catch(err => console.error(err));
  }, [username]);

  const deleteReview = (reviewId: string) => {
    const token = localStorage.getItem('token');
    
    axios.delete(`http://localhost:3000/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setReviews(prev => prev.filter(r => r._key !== reviewId));
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
              <div className="review">
                <div className="movie-rating">
                  <span id="movie">{r.movie}</span>
                  <span className="rating">
                    {[1,2,3,4,5].map(star => <span key={star}>{star <= r.rating ? "★" : ""}</span>)}
                  </span>
                  <div className="review-buttons">
                    <button onClick={() => setEditingReview(r)}><img src={editIcon} /></button>
                    <button onClick={() => deleteReview(r._key)}><img src={deleteIcon} /></button>
                  </div>
                </div>
                <p id="comment">{r.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserReviews