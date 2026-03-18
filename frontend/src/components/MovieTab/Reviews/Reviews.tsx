import { useEffect, useState } from 'react'
import "./Reviews.css";
import Form from './Form/Form';

const Reviews = ({ movieId }: { movieId?: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/reviews/${movieId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setReviews(data);
        }
      })
      .catch((err) => {console.error(err)});
  }, [ movieId ]);

  if (!reviews || reviews.length == 0) return <Form movieId={movieId} />;

  return (
    <div>
      <div className="reviews-list">
        {reviews.map((r, index) => (
          <div key={index}> 
            <div className="review">
              <div className="user-rating">
                <span id="username">Recenzija od <b>{r.username}</b></span>
                <span className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= r.rating ? "★" : ""}
                    </span>
                  ))}
                </span>
              </div>
              <p id="comment">{r.comment}</p>              
            </div>
          </div>
        ))}
      </div>
      <Form movieId={movieId} />
    </div>
  )
}

export default Reviews
