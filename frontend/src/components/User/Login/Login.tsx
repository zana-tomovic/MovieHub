import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Login.css";
import image from '../../../assets/images/image1.jpg'
import visibilityIcon from '../../../assets/images/visibility.png';
import visibilityOffIcon from '../../../assets/images/visibility-off.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  let navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError('Molimo Vas popunite sva polja.');
      return;
    }

    axios.post(`http://localhost:3000/auth/login`, {
      username,
      password
    })
    .then((res) => {
      localStorage.setItem('token', res.data.accessToken);
      navigate("/");
    })
    .catch((error) => {
      console.log(error.message);
    })

    setError('');
  }

  return (
    <div id="login">
      <div id="login-left">
        <form onSubmit={handleSubmit}>
          <p id="message">Dobrodošli nazad na <b>MovieHub</b>! Prijavite se kako biste nastavili.</p>

          <div id="username">
            <p className="label">Korisničko ime</p>
            <input 
              type="text" 
              placeholder="" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div id="pass">
            <p className="label">Lozinka</p>
            <input 
            type={showPassword ? 'text' : 'password'}
            placeholder="" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              id="btnVisibility"
              aria-label="Prikaži lozinku"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src={showPassword ? visibilityIcon : visibilityOffIcon} />
            </button>
          </div>

          {error && <p style={{color: 'red'}}>{error}</p>}

          <button type="submit" id="btnLogin">Prijavi se</button>

          <p>Nemas nalog? <a href="/register">Registruj se.</a> </p>
        </form>
      </div>

      <div id="login-right">
        <img src={image} />
      </div>
    </div>
  )
}

export default Login