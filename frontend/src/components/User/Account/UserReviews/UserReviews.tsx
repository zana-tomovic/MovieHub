import React, { useEffect, useState } from 'react'
import axios from 'axios';

import editIcon from "../../../../assets/images/edit.png";
import deleteIcon from "../../../../assets/images/delete.png";
import checkIcon from "../../../../assets/images/check.png";
import closeIcon from "../../../../assets/images/close.png";
import "./UserReviews.css";

const UserReviews = ({username}: {username?: string}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [review, setReview] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/reviews/user/${username}`)
        .then(res => res.json()) 
        .then(data => {
            if(data) {
              setReviews(data);
            }
        })   
        .catch(err => console.error(err));
  }, [username]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!review.rating) return;

    const token = localStorage.getItem('token');

    axios.patch(`http://localhost:3000/reviews/update`, 
    { 
      _id: review._id,
      rating: review.rating,
      comment: review.comment || null
    }, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(() => {
      setReviews(prev =>
        prev.map(r => r._key === review._key 
          ? { ...r, rating: review.rating, comment: review.comment }
          : r
        )
      );

      setReview(null);
    })
    .catch(err => {
      console.error(err);
      alert("Došlo je do greške prilikom slanja.");
    });
  } 

  const editReview = (r: any) => {
    setReview({ ...r });
  }

  const cancelEdit = () => {
    setReview(null);
  }

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

  if (!reviews || reviews.length === 0) return <p id="messageNoReviews">Nemate kreiranih recenzija.</p>;

  return (
    <div className="userReviews">
      <div className="reviews-list">
        {reviews.map(r => (
          <div key={r._key}>
            {review && review._key === r._key ? (
              <form className="review-edit" onSubmit={handleSubmit}>
                <div className="rating">
                  {[5,4,3,2,1].map(num => (
                    <React.Fragment key={num}>
                      <input
                        type="radio"
                        name={`rating-${review._key}`}
                        id={`star-${num}-${review._key}`}
                        value={num}
                        checked={review.rating === num}
                        onChange={() => setReview(prev => prev && { ...prev, rating: num })}
                      />
                      <label htmlFor={`star-${num}-${review._key}`}>★</label>
                    </React.Fragment>
                  ))}
                </div>
               
                <div className="comment">
                  <textarea
                    value={review.comment}
                    onChange={e => setReview(prev => prev && { ...prev, comment: e.target.value })}
                  />
                </div>

                <div>
                  <button type="submit"><img src={checkIcon} alt="Sačuvaj" /></button>
                  <button type="button" onClick={cancelEdit}><img src={closeIcon} alt="Otkaži" /></button>
                </div>
              </form>
            ) : (
              <div className="review">
                <div className="movie-rating">
                  <span id="movie"> {r.movie} </span>
                  <span className="rating">
                    {[1,2,3,4,5].map(star => <span key={star}>{star <= r.rating ? "★" : ""}</span>)}
                  </span>
                  <div className="review-buttons">
                    <button onClick={() => editReview(r)}><img src={editIcon} /></button>
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