import { useEffect, useState } from "react";
import "./Reviews.css";

const batch_size = 4;

const Reviews = ({ movieKey }: { movieKey: string | undefined }) => {
  const [ reviews, setReviews ] = useState<any>([]);
  const [ visible, setVisible ] = useState<any>([]);

  useEffect(() => {
    getReviews();
  }, [])

  const getReviews = () => {
    fetch(`http://localhost:3000/reviews/${movieKey}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setReviews(data);
          setVisible(data.slice(0, batch_size));
        }
      })
      .catch((err) => {console.error(err)});
  }

  const loadMore = () => {
    const nextEnd = visible.length + batch_size;
    setVisible(reviews.slice(0, nextEnd));
  }

  return (
    <div>
      <div className="reviews-list">
        {visible.map((v, index) => (
          <div key={index}> 
            <div className="review">
              <div className="user-rating">
                <span id="username">Review from <b>{v.username}</b></span>
                <span className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= v.rating ? "★" : ""}
                    </span>
                  ))}
                </span>
              </div>
              <p id="comment">{v.comment}</p>              
            </div>
          </div>
        ))}
      </div>
      <div className="reviewBtn"> 
        <button id="loadBtn" onClick={loadMore}>Load more...</button>
      </div>
    </div>
  )
}

export default Reviews
