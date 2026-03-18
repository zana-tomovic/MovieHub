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
      setError('Molimo Vas popunite sva polja.');
      return;
    }

    axios.post(`http://localhost:3000/users`, {
      username,
      email,
      password
    })
    .then((res) => {
      console.log(res.data);
      navigate("/login");
    })
    .catch((error) => {
      console.log(error.message);
    })
  }

  return (
    <div id="register">
      <div id="register-left">
        <form onSubmit={handleSubmit}>
          <p id="message">Dobrodošli na <b>MovieHub</b>! <br /> Kreirajte svoj nalog za bolji doživljaj.</p>
          
          <div id="username">
            <p className="label">Korisničko ime</p>
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
            <p className="label">Lozinka</p>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="" 
              value={password || ''}
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

          <button type="submit" id="btnRegister">Registruj se</button>

          <p>Imas nalog? <a href="/login">Prijavi se.</a> </p>
        </form>
      </div>

      <div id="register-right">
         <img src={image} />            
      </div>
    </div>
  )
}

export default Register
