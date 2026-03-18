import React, { useEffect, useState } from 'react'
import axios from 'axios';
import "./Form.css"

const Form = ({ movieId }: { movieId?: string }) => {
  const [rating, setRating] = useState<number>();
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get(`http://localhost:3000/auth/loggedUser`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setUsername(res.data.username);
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) {
      alert("Morate biti prijavljeni da biste ostavili recenziju.");
      return;
    }

    if (!rating) {
      alert("Molimo vas da odaberete ocenu.");
      return;
    }

    const token = localStorage.getItem('token');
    
    axios.post(`http://localhost:3000/reviews/${movieId}`, 
    { 
      rating: Number(rating),
      comment: comment || null,
      username: username
    }, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(() => {
      window.location.reload();

      setComment('');
      setRating(0);
    })
    .catch((err) => {
      console.error(err);
    })
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
              onChange={() => setRating(num)}
            />
            <label htmlFor={`star-${num}`}>★</label>          
          </React.Fragment>
         )
        )} 
        </div>

        <div className="comment">
          <textarea 
            placeholder="Podijeli svoje misljenje sa nama..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit" id="btnSubmit">Podijeli</button>
      </form>
    </div>
  )
}

export default Form
