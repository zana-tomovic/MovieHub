import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./Account.css";
import UserReviews from './UserReviews/UserReviews';
import EditAcc from './EditAcc/EditAcc';
import axios from 'axios';

const Account = () => {
  const { username } = useParams();
  const [user, setUser] =  useState<any>(null);
  const [mode, setMode] = useState<'pass' | 'reviews' | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
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
  }, [username]);

  const seeReviews = () => {
    setMode("reviews");
  }

  const editAcc = () => {
    setMode("pass");
  }

  const deleteAcc = () => {
    const yes = confirm("Da li želite da nastavite sa brisanjem naloga?");

    if (yes) {
      const token = localStorage.getItem('token');

      axios.delete(`http://localhost:3000/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        localStorage.removeItem('token'); 
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  return (
    <div className="acc">
      <div className="navbar">
        <div className="navbar-items">
          <button onClick={seeReviews}>Moje recenzije</button>
          <button onClick={editAcc}>Izmijenite nalog</button>
          <button onClick={deleteAcc}>Izbrisite nalog</button>
        </div>
      </div>
      <div className="page">
        {mode == "pass" && <EditAcc user={user} />}
        {mode == "reviews" && <UserReviews username={username} />}  
      </div>
    </div>
  )
}

export default Account
