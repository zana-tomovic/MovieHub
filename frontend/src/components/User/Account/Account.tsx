import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "../Account/Account.css";

import user_pic from '../../../assets/images/user.png';
import add_pic from '../../../assets/images/add-image.png';

import visibilityIcon from '../../../assets/images/visibility.png';
import visibilityOffIcon from '../../../assets/images/visibility-off.png';

import Nav from '../../Nav/Nav'
import UserReviews from './UserReviews/UserReviews';
import Movies from './Movies/Movies';

const Account = () => {
  const { username } = useParams();
  const [ user, setUser ] = useState<any>();
  const [ mode, setMode ] = useState("reviews");st
  const [ edit, setEdit ] = useState(false);

  const [ email, setEmail ] = useState('');
  
  const [ file, setFile ] = useState<File | null>(null);
  const [ preview, setPreview ] = useState("");

  const [ pass1, setPass1 ] = useState(''); 
  const [ pass2, setPass2 ] = useState('');

  const [ showPass1, setShowPass1 ] = useState(false);
  const [ showPass2, setShowPass2 ] = useState(false);

  const [ error, setError ] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:3000/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) {
        setUser(res.data);
        setEmail(res.data.email);
        setFile(res.data.image || "");
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }, [username]);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
  
    if (pass1 || pass2) {
      if (pass1 !== pass2) {
        setError('Passwords do not match. Please try again.');
        return;
      }
    }

    const formData = new FormData();

    formData.append("username", user.username);
    formData.append("email", email);

    if (pass1) {
      formData.append("pass", pass1);
    }

    if (file) {
      formData.append("image", file);
    }

    const token = localStorage.getItem('token');
    
    axios.patch(`http://localhost:3000/users`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      alert("Successfully updated.");
      setEdit(false);

      window.location.reload()
    })
    .catch((error) => {
      console.log(error.message);
    })
  }

  const deleteAcc = () => {
    const yes = confirm("Are you sure you want to delete your account?");

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
    <div>
      <Nav />
      <div className="user-acc">
        <div className="user">
            <div className={`user-edit ${edit ? 'active' : ''}`}>
              <form onSubmit={handleSave}>
                <label htmlFor="file">
                    {user?.image ? (
                        <img src={user?.image} />
                    ) : preview ? (
                      <img src={preview} />
                    ) : (
                        <div className="add-pic">
                          <img src={add_pic} />
                        </div>
                    )}
                </label>
               
                <input 
                  type="file" 
                  id="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];

                    if (selectedFile) {
                      setPreview(URL.createObjectURL(selectedFile));
                      setFile(selectedFile);
                    }
                  }}
                />

              <div className="user-edit-details">
                <div id="email">
                  <p>Email</p>
                  <input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>    
                
                <div className="pass">
                  <div>
                    <p>Password</p>
                    <input 
                      type={showPass1 ? 'text' : 'pass'}
                      placeholder="" 
                      value={pass1 || ''}
                      onChange={(e) => setPass1(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btnVisibility"
                      aria-label="Show password"
                      onClick={() => setShowPass1(!showPass1)}
                    >
                      <img src={showPass1 ? visibilityIcon : visibilityOffIcon} />
                    </button>
                  </div>

                  <div>
                    <p>Repeat password</p>
                    <input 
                      type={showPass2 ? 'text' : 'pass'}
                      placeholder="" 
                      value={pass2 || ''}
                      onChange={(e) => setPass2(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btnVisibility"
                      aria-label="Show password"
                      onClick={() => setShowPass2(!showPass2)}
                    >
                      <img src={showPass2 ? visibilityIcon : visibilityOffIcon} />
                    </button>
                  </div>
                </div>

                {error && <p style={{color: 'red'}}>{error}</p>}

                <div className="edit-button">
                    <button type="submit">Save</button>  
                    <button type="button" onClick={() => setEdit(false)}>Cancel</button>    
                </div>
              </div>
              </form>
            </div>
            <div className={`user-view ${!edit ? 'active' : ''}`}>
                {user?.image ? (
                  <img src={user?.image}/>
                ) : (
                  <img src={user_pic}/>
                )}
                <div className="user-details">
                    <p>{username}</p>
                    <button onClick={() => setEdit(true)}>Edit</button>      
                </div>
            </div>
        </div>
        <div className="user-acc-nav">
          <button
           className={mode === "reviews" ? "active" : ""}
           onClick={() => setMode("reviews")}
          >
            My reviews
          </button>
          <button 
            className={mode === "movies" ? "active" : ""}
            onClick={() => setMode("movies")}
          >
            Movies
          </button>
          <button onClick={deleteAcc}>
            Delete account
          </button>
        </div> 
        <div className="user-acc-page">
          {mode === "reviews" && <UserReviews username={username}/>}
          {mode === "movies" && <Movies username={username}/>}
        </div>    
      </div>
    </div>
  )
}

export default Account
