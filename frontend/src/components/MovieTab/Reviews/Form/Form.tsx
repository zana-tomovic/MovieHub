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

  const commentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);

      if (commentRef.current) {
        commentRef.current.innerText = review.comment ?? '';
      }
    }
  }, [review])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (review) {
      axios.patch(`http://localhost:3000/reviews`, 
      { _id: review._id, rating: Number(rating), comment },
      { headers: { Authorization: `Bearer ${token}` }})
      .then(() => window.location.reload())
      .catch(console.error);
    } else {
      axios.post(`http://localhost:3000/reviews/${movieKey}`, 
      { rating: Number(rating), comment, username },
      { headers: { Authorization: `Bearer ${token}` }})
      .then(() => window.location.reload())
      .catch(console.error);
    }
  } 

  return (
    <div>
      <form className= "review-form" onSubmit={handleSubmit}> 
        <div className="rating">
         {[5, 4, 3, 2, 1].map ((num) => (
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
          <div 
            ref={commentRef}
            className="comment"
            contentEditable={true}
            suppressContentEditableWarning={true}
            data-placeholder="Share your thoughts with us..."
            onInput={(e) => setComment(e.currentTarget.innerText)}
          ></div>
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
