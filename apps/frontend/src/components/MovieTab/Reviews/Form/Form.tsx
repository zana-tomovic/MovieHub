import React, { useEffect, useState } from 'react'
import axios from 'axios';
import "./Form.css"

import user_pic from '../../../../assets/images/user.png';
import saveIcon from '../../../../assets/images/save.png';
import closeIcon from '../../../../assets/images/close.png';

const Form = ({ 
    movieKey,
    review, 
    username,
    onClose
  }: { 
    movieKey?: string, 
    review?: any,
    username?: string
    onClose?: () => void
  }) => {
  const [ user, setUser ] = useState<any>();
  const [rating, setRating] = useState<number>(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || '');
  const [spoiler, setSpoiler] = useState<boolean>(review?.spoiler ?? false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (username) {
      getUser(username)
    }

    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setSpoiler(review.spoiler);
    }
  }, [review])

  const getUser = (username: string) => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:3000/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setUser(res.data);
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    const token = localStorage.getItem('token');

    if (review) {
      axios.patch(`http://localhost:3000/reviews`, 
      { _id: review._id, rating: Number(rating), comment, spoiler },
      { headers: { Authorization: `Bearer ${token}` }})
      .catch(console.error);
    } else {
      axios.post(`http://localhost:3000/reviews/${movieKey}`, 
      { rating: Number(rating), comment, spoiler, username },
      { headers: { Authorization: `Bearer ${token}` }})
      .catch(console.error);
    }
  } 

  return (
    <div>
      {review ? (
        <form className="review-edit-form" onSubmit={handleSubmit}>
          <div className="review-buttons">
            <button id="save" type="submit"><img src={saveIcon}/></button>
            <button id="close" type="button" onClick={onClose}><img src={closeIcon}/></button>
          </div>

          <div className="movie-card">
            <img src={review.poster} />
          </div>

          <div className="review-content">
            <div className="movie-rating">
              <span id="movie"><b>{review.movie}</b> ({review.date?.split("-")[0]})</span>
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
                ))} 
              </div>
            </div>

            <div className="comment-box">
              <textarea
                className="comment"
                value={comment}
                placeholder="Share your thoughts with us..."
                onChange={(e) => { 
                  setComment(e.currentTarget.value),
                  setIsActive(true)
                }}
              />

              {isActive && (
                <label className="checkbox">
                  <input 
                    type="checkbox" 
                    checked={spoiler}
                    onChange={(e) => setSpoiler(e.target.checked)}
                  />
                    Contains spoilers?
                </label>
              )}
            </div>  
          </div>
        </form>
      ) : (
        <form className= "review-form" onSubmit={handleSubmit}> 
          <img src={user?.image ? `http://localhost:3000${user.image}` : user_pic}/>

          <div className="review-form-input">
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
              ))} 
            </div>

            <div className="comment-box">
              <textarea
                className="comment"
                value={comment}
                placeholder="Share your thoughts with us..."
                onChange={(e) => { 
                  setComment(e.currentTarget.value),
                  setIsActive(true)
                }}
              />

              {isActive && (
                <label className="checkbox">
                  <input 
                    type="checkbox" 
                    checked={spoiler}
                    onChange={(e) => setSpoiler(e.target.checked)}
                  />
                    Contains spoilers?
                </label>
              )}
            </div>
            <div className="review-form-buttons">
              <button type="submit">Save</button>
            </div>    
          </div>
        </form>
      )}
    </div>
  )
}

export default Form
