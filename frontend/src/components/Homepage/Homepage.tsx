import { useEffect, useState } from 'react';
import "./Homepage.css";
import Nav from '../Nav/Nav'
import SlideShow from './SlideShow';
import Rec from '../MovieTab/Rec/Rec';
import axios from 'axios';

const Homepage = () => {
  const [ newMov, setNewMov ] = useState<any>([]);
  const [ recs, setRecs ] = useState<any>([]);
  const [ userRecs, setUserRecs ] = useState<any>([]);
  const [ username, setUsername ] = useState('');

    useEffect(() => {
      getUser();
      getNewMovies();
      getPopularRecs();
    }, []);

    useEffect(() => {
      if (username) {
        getRecForUser();
      }
    }, [username]); 

    const getUser = () => {
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
  }

  const getNewMovies = () => {
    fetch(`http://localhost:3000/movies/recs/new`)
    .then(res => res.json())
    .then(data => {
        if (data) {
          setNewMov(data);
        }
    })
    .catch(err => console.error(err));
  };

  const getPopularRecs = () => {
    fetch(`http://localhost:3000/movies/recs/popular`)
      .then(res => res.json())
      .then(data => {
        if (data) {
            setRecs(data);
        }
      })
      .catch(err => console.error(err));
  };

  const getRecForUser = () => {
    fetch(`http://localhost:3000/movies/recs/user/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
            console.log(data);
            setUserRecs(data);
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="home">
      <Nav />
      <div className="home-items">
        <SlideShow newMov={newMov} />
        <div className="home-recs">
          <Rec recs={recs} mess={"Popular: "}  /> 
          {username && <Rec recs={userRecs} />}
        </div>
      </div>
    </div>
  )
}

export default Homepage
