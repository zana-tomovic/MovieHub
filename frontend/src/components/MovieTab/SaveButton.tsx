import { useEffect, useState } from 'react'
import "../MovieTab/SaveButton.css";

import saved from '../../assets/images/saved.png';
import unsaved from '../../assets/images/unsaved.png';

import unseen from '../../assets/images/visibility.png';
import seen from '../../assets/images/visibility-off.png';
import axios from 'axios';

const SaveButton = ({movieKey, username}: {movieKey: string | undefined, username: string}) => {
    const [ isSaved, setIsSaved ] = useState(false);
    const [ isSeen, setIsSeen ] = useState(false);

    useEffect(() => {
        if (username) {
            getSaved();
            getSeen();
        }
    }, [username]);

    const getSaved = () => {
      const token = localStorage.getItem('token');

      axios.get(
        `http://localhost:3000/movies/saved/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        setIsSaved(res.data.some((m: any) => m._key == movieKey))
      })
      .catch(err => console.error(err));
    }

  const saveMovie = () => {
    if (!username) {
      alert("You have to be signed in to save.");
      return;
    }

    const token = localStorage.getItem('token');

    axios.post(
      `http://localhost:3000/movies/saved/${movieKey}`,
      {
        username: username
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setIsSaved(true);
    })
    .catch(err => console.error(err));
  };

  const removeMovie = () => {
    const token = localStorage.getItem('token');

    axios.delete(
      `http://localhost:3000/movies/saved/${movieKey}`,
      {
        data: {
          username: username
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setIsSaved(false);
    })
    .catch(err => console.error(err));
  }

  const getSeen = () => {
    const token = localStorage.getItem('token');

    axios.get(
      `http://localhost:3000/movies/seen/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {  
      setIsSeen(res.data.some((m: any) => m._key == movieKey));   
    })
    .catch(err => console.error(err));
  }

  const setMovieToSeen = () => {
    if (!username) {
      alert("You have to be signed in to save.");
      return;
    }

    const token = localStorage.getItem('token');

    axios.post(
      `http://localhost:3000/movies/seen/${movieKey}`,
      {
        username: username
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setIsSeen(true);
    })
    .catch(err => console.error(err));
  };

  const removeSeen = () => {
    const token = localStorage.getItem('token');

    axios.delete(
      `http://localhost:3000/movies/seen/${movieKey}`,
      {
        data: {
          username: username
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      setIsSeen(false);
    })
    .catch(err => console.error(err));
  }

  return (
    <div className="save-seen"> 
        <div className="save">
            {isSaved ? (
            <button id="save-button" onClick={removeMovie}>
                <img src={saved} />
            </button>
            ) : (
            <button id="unsave-button" onClick={saveMovie}>
                <img src={unsaved} />
            </button>
            )}
        </div>
        <div className="seen">
            {isSeen ? (
            <button id="seen-button" onClick={removeSeen}>
                <img src={seen} />
            </button>
            ) : (
            <button id="unseen-button" onClick={setMovieToSeen}>
                <img src={unseen} />
            </button>
            )}
        </div>
    </div>
  )
}

export default SaveButton
