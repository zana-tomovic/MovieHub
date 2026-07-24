import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Reviews.css";

import user_pic from '../../../assets/images/user.png';
import heart from '../../../assets/images/heart.png';
import heart_fill from '../../../assets/images/heart fill.png';
import axios from "axios";

const batch_size = 4;

const Reviews = ({ movieKey, popular, username }: { movieKey?: string | undefined, popular?: any, username?: string }) => {
  const [ reviews, setReviews ] = useState<any>([]);
  const [ visible, setVisible ] = useState<any>([]);

  const [ isLiked, setIsLiked ] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (popular) {
      setReviews(popular);
    } 

    if (movieKey) {
      getReviews();
    }

  }, [popular, movieKey])

  useEffect(() => {
    getLikes();
  }, [username]);

  const getReviews = () => {
    fetch(`http://localhost:3000/reviews/${movieKey}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setReviews(data);
          setVisible(data.slice(0, batch_size));
          console.log(data);
        }
      })
      .catch((err) => {console.error(err)});
  }
    
  const loadMore = () => {
    const nextEnd = visible.length + batch_size;
    setVisible(reviews.slice(0, nextEnd));
  }

  const getLikes = () => {
    if (!username) return;

    const token = localStorage.getItem('token');

      axios.get(
        `http://localhost:3000/reviews/liked/user/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        setIsLiked(res.data.map((r: any) => r._key))
      })
      .catch(err => console.error(err));
  }

  const likeReview = (key: string) => {
    if (!username) {
      alert("You have to be signed in to save.");
      return;
    }

    const token = localStorage.getItem('token');

     axios.post(
      `http://localhost:3000/reviews/liked/${key}`,
      {
        username: username
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
      setIsLiked((prev) => [...prev, key]);

      const updatedCount = res.data.Num_Likes;

      setReviews((prev: any[]) =>
        prev.map((r) => (r._key == key ? { ...r, Num_Likes: updatedCount } : r))
      );

      setVisible((prev: any[]) =>
        prev.map((v) => (v._key == key ? { ...v, Num_Likes: updatedCount } : v))
      );
    })
    .catch(console.error);
  }

  const removeLiked = (key: string) => {
    const token = localStorage.getItem('token');

     axios.delete(
      `http://localhost:3000/reviews/liked/${key}`,
      {
        data: {
          username: username
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
      setIsLiked((prev) => prev.filter((k) => k !== key));

       const updatedCount = res.data.Num_Likes;

      setReviews((prev: any[]) =>
        prev.map((r) => (r._key == key ? { ...r, Num_Likes: updatedCount } : r))
      );

      setVisible((prev: any[]) =>
        prev.map((v) => (v._key == key ? { ...v, Num_Likes: updatedCount } : v))
      );
    })
    .catch(console.error);
  }

  return (
    <div>
      {popular ? (
        <div className="popular-reviews-list"> 
          {reviews.map((r, index) => (
              <div key={index}> 
                <div className="review">
                  <div 
                    className="movie-card"
                    onClick={() => navigate(`/movie/${r.movie_key}`)}
                  >
                    <img src={r.poster} />
                  </div>

                  <div className="review-content">
                    <span id="movie"><b>{r.movie}</b> ({r.date?.split("-")[0]})</span>

                    <div className="review-user">
                      <div className="user-rating">
                        <span id="username" onClick={() => navigate(`/${r.username}`) }>Review from <b>{r.username}</b></span>
                        <span className="rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= r.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </span>
                        </div>
                    </div>
                  
                    {r.spoiler && (
                      <p id="spoiler">This review may contain spoilers.</p>
                    )}

                    <p id="comment">{r.comment}</p>  

                    {isLiked.includes(r._key) ? (  
                      <div className="heart_fill">
                        <button
                          onClick={() => removeLiked(r._key)}  
                        >
                          <img src={heart_fill} />
                        </button>
                        <p>{r.Num_Likes} {r.Num_Likes > 1 ? "likes" : "like"}</p>
                      </div>
                      ) : (
                        <div className="heart">
                          <button
                            onClick={() => likeReview(r._key)}  
                          >
                            <img src={heart} />
                          </button>
                          <p>{r.Num_Likes} {r.Num_Likes > 1 ? "likes" : "like"}</p>
                        </div>
                      )}
                    </div>   
                </div>
              </div>
            ))}
        </div>
      ) : (
        movieKey && (
          <>
          <div className="reviews-list">
            {visible.map((v, index) => (
              <div key={index}> 
                <div className="review">

                <div className="review-user">
                    <img src={user_pic} />

                    <div className="user-rating">
                      <span id="username" onClick={() => navigate(`/${v.username}`) }>Review from <b>{v.username}</b></span>
                      <span className="rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= v.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </span>
                      </div>
                  </div>
                  
                  {v.spoiler && (
                    <p id="spoiler">This review may contain spoilers.</p>
                  )}

                  <p id="comment">{v.comment}</p>  

                {isLiked.includes(v._key) ? (  
                  <div className="heart_fill">
                    <button
                      onClick={() => removeLiked(v._key)}  
                    >
                      <img src={heart_fill} />
                    </button>
                    <p>{v.Num_Likes} {v.Num_Likes > 1 ? "likes" : "like"}</p>
                  </div>
                  ) : (
                    <div className="heart">
                      <button
                        onClick={() => likeReview(v._key)}  
                      >
                        <img src={heart} />
                      </button>
                      <p>{v.Num_Likes} {v.Num_Likes > 1 ? "likes" : "like"}</p>
                    </div>
                  )}   
                </div>
              </div>
            ))}
          </div>
          <div className="reviewBtn"> 
            {visible.length < reviews.length && (
              <button id="loadBtn" onClick={loadMore}>Load more...</button>
            )}
          </div>
         </>
        )
      )}
    </div>
  )
}

export default Reviews
