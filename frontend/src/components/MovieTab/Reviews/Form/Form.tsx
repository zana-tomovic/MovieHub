import React, { useEffect, useState } from 'react'
import axios from 'axios';
import "./Form.css"

const Form = ({ 
    movieKey,
    review, 
    username,
    onCancel 
  }: { 
    movieKey?: string, 
    review?: any,
    username?: string,
    onCancel?: () => void 
  }) => {
  const [rating, setRating] = useState<number>(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || '');
  const [spoiler, setSpoiler] = useState(review?.spoiler || '');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setSpoiler(review.spoiler);
    }
  }, [review])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (review) {
      axios.patch(`http://localhost:3000/reviews`, 
      { _id: review._id, rating: Number(rating), comment, spoiler },
      { headers: { Authorization: `Bearer ${token}` }})
      .then(() => window.location.reload())
      .catch(console.error);
    } else {
      axios.post(`http://localhost:3000/reviews/${movieKey}`, 
      { rating: Number(rating), comment, spoiler, username },
      { headers: { Authorization: `Bearer ${token}` }})
      .then(() => window.location.reload())
      .catch(console.error);
    }
  } 

  return (
    <div>
      <form className= "review-form" onSubmit={handleSubmit}> 
        <div className="rating">
         {[1, 2, 3, 4, 5].map ((num) => (
          <React.Fragment key={num}>
            <input
              type="radio"
              name="rating"
              id={`star-${num}`}
              value={num}
              checked={rating === num}
              onChange={() => setRating(num)}
            />
            <label htmlFor={`star-${num}`}>★</label>          
          </React.Fragment>
         )
        )} 
        </div>

        <div className="comment-box">
          <textarea
            className="comment"
            value={comment}
            placeholder="Share your thoughts with us..."
            onInput={(e) => { 
              setComment(e.currentTarget.value),
              setIsActive(true)
            }}
          />
          {isActive && (
            <label className="checkbox">
              <input type="checkbox" onChange={setSpoiler}/>
              Contains spoilers?
            </label>
          )}
        </div>
        <div className="review-form-buttons">
          <button type="submit">Save</button>
          {review && onCancel && (
            <button type="button" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  )
}

export default Form
