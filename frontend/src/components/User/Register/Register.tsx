import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Register.css";
import image from '../../../assets/images/image2.jpg'
import visibilityIcon from '../../../assets/images/visibility.png';
import visibilityOffIcon from '../../../assets/images/visibility-off.png';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  let navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!username || !email || !password) {
      setError('Please fill every field.');
      return;
    }

    axios.post(`http://localhost:3000/users`, {
      username,
      email,
      password
    })
    .then((res) => {
      navigate("/login");
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        setError("Username is not available.");
      }
    })
  }

  return (
    <div id="register">
      <div id="register-left">
        <form onSubmit={handleSubmit}>
          <p id="message">Welcome to <b>MovieHub</b>! <br />Create your user account for better experience.</p>
          
          <div id="username">
            <p className="label">Username</p>
            <input 
              type="text" 
              placeholder="" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div> 

          <div id="email">
            <p className="label">Email</p>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div id="pass">
            <p className="label">Password</p>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="" 
              value={password || ''}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              id="btnVisibility"
              aria-label="Show password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src={showPassword ? visibilityIcon : visibilityOffIcon} />
            </button>
          </div>

          {error && <p style={{color: 'red'}}>{error}</p>}

          <button type="submit" id="btnRegister">Register.</button>

          <p>Already have an account? <a href="/login">Sign in.</a> </p>
        </form>
      </div>

      <div id="register-right">
         <img src={image} />            
      </div>
    </div>
  )
}

export default Register
