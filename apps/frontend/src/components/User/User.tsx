import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./User.css";

import user_pic from '../../assets/images/user.png';
import add_pic from '../../assets/images/add-image.png';

import visibilityIcon from '../../assets/images/visibility.png';
import visibilityOffIcon from '../../assets/images/visibility-off.png';

import UserReviews from './UserReviews/UserReviews';
import Movies from './UserMovies/UserMovies';
import Nav from '../Nav/Nav';
import UserFollower from './UserFollowers/UserFollower';

const User = () => {
  const { username } = useParams();
  const [ user, setUser ] = useState<any>();
  const [ loggedUser, setLoggedUser ] = useState<any>();
  const [ mode, setMode ] = useState("reviews");
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

  const [ isFollowed, setIsFollowed ] = useState(false);
  const [ showFollowers, setShowFollowers ] = useState(false);
  const [ followersMode, setFollowersMode ] = useState<"followers" | "followed">("followers");
  
  const isLoggedUser = loggedUser?.username == username;

  useEffect(() => {
    getLoggedUser();
    getUser();
    setShowFollowers(false);
  }, [username])

  useEffect(() => {
    if (user && loggedUser && !isLoggedUser) {
      getIsFollowed(user._id);
    }
  }, [user, loggedUser])

  const getLoggedUser = () => {
    const token = localStorage.getItem('token');
    
    axios.get(`http://localhost:3000/auth/loggedUser`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.data) setLoggedUser(res.data);
    })
    .catch();
  }

  const getUser = () => {
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

  const handleDelete = () => {
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

  const getIsFollowed = (followedId: string) => {
    const token = localStorage.getItem('token');

    axios.get(
      `http://localhost:3000/followers/isFollower`,
      {
        params: {
          followerId: loggedUser._id,
          followedId: followedId
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
      setIsFollowed(res.data);
    })
    .catch(err => console.error(err));
  }

  const followUser = (followedId: string) => {
    const token = localStorage.getItem('token');    

    axios.post(
      `http://localhost:3000/followers`, 
      {
        followerId: loggedUser._id,
        followedId: followedId
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
        const updatedCount = res.data.num_followers;
        setUser((prev: any) => ({ ...prev, num_followers: updatedCount }));

        setIsFollowed(true);
    })
    .catch(err => console.error(err));
  }

  const unfollowUser = (followedId: string) => {
    const token = localStorage.getItem('token');    

    axios.delete(
      `http://localhost:3000/followers`, 
      {
        data: {
          followerId: loggedUser._id,
          followedId: followedId
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => {
        const updatedCount = res.data.num_followers;
        setUser((prev: any) => ({ ...prev, num_followers: updatedCount }));

        setIsFollowed(false);
    })
    .catch(err => console.error(err));
  }

  return (
    <div>
      <Nav />
      <div className="user-acc">
        <div className="user">
            <div className={`user-edit ${edit ? 'active' : ''}`}>
              <form onSubmit={handleSave}>
                <label htmlFor="file">
                    {preview ? (
                      <img src={preview} />
                    ) : user?.image ? (
                      <img src={`http://localhost:3000${user.image}`} />
                    ) : (
                      <div className="add-image">
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
                        type={showPass1 ? 'text' : 'password'}
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
                        type={showPass2 ? 'text' : 'password'}
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
                <div className="user-image">
                  <img src={user?.image ? `http://localhost:3000${user.image}` : user_pic}/>
                </div>

                <div className="user-view-details">
                    <div> 
                      <p>{username}</p>
                      <p 
                        className={`hasFollowers ${!user?.num_followers ? 'disabled' : ''}`}
                        onClick={() => {
                          if (user?.num_followers) {
                            setFollowersMode("followers"), setShowFollowers(true);
                          }
                        }}
                      >
                        {user?.num_followers ?? 0} followers
                      </p>

                      <p 
                        className={`hasFollowed ${!user?.num_followed ? 'disabled' : ''}`}
                        onClick={() => {
                          if (user?.num_followed) {
                            setFollowersMode("followed"), setShowFollowers(true);
                          }
                        }}
                      >
                        {user?.num_followed ?? 0} followed
                      </p>
                    </div>

                    {isLoggedUser ? (
                      <button id="edit" onClick={() => setEdit(true)}>Edit</button>      
                    ) : (
                      <button id="follow" onClick={() => isFollowed ? unfollowUser(user?._id) : followUser(user?._id)}>{isFollowed ? "Unfollow" : "Follow"}</button>
                    )}
                </div>
            </div>
        </div>
        <div className="user-acc-nav">
          <button
           className={mode === "reviews" ? "active" : ""}
           onClick={() => setMode("reviews")}
          >
            {isLoggedUser ? "My reviews" : "Reviews"}
          </button>
          <button 
            className={mode === "movies" ? "active" : ""}
            onClick={() => setMode("movies")}
          >
            Movies
          </button>
          {isLoggedUser && (
            <button onClick={handleDelete}>
              Delete account
            </button>
          )}
        </div> 
        <div className="user-acc-page">
          {mode === "reviews" && <UserReviews username={username} isLoggedIn={isLoggedUser}/>}
          {mode === "movies" && <Movies username={username}/>}
        </div>    
      </div>

      {showFollowers && (
        <div className="followers-overlay active" onClick={() => setShowFollowers(false)}>
          <UserFollower
            userId={user?._id}
            loggedUserId={loggedUser?._id}
            followersMode={followersMode == "followers"}
            isLogged={isLoggedUser}
            onClose={() => setShowFollowers(false)}
          />
        </div>
      )}
    </div>
  )
}

export default User
