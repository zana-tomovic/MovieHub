import React, { useState } from 'react'
import axios from 'axios';
import visibilityIcon from '../../../../assets/images/visibility.png';
import visibilityOffIcon from '../../../../assets/images/visibility-off.png';
import "./EditAcc.css";

const EditAcc = ({user}: {user?: any}) => {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [password2, setPassword2] = useState('');
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (password1 || password2) {
      if (password1 !== password2) {
        setError('Lozinke se ne podudaraju.');
        return;
      }
    }

    const updatedUser: any = {
      username: user.username,
      email: email || user.email
    }

    if (password1) {
      updatedUser.password = password1;
    }

    const token = localStorage.getItem('token');
    
    axios.patch(`http://localhost:3000/users/update`, updatedUser, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("Lozinka je promijenjena.");
    })
    .catch((error) => {
      console.log(error.message);
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div id="email">
          <p className="label">Email</p>
          <input
            type="email"
            placeholder=""
            value={user.email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div id="pass1">
            <p className="label">Lozinka</p>
            <input 
              type={showPassword1 ? 'text' : 'password'}
              placeholder="" 
              value={password1 || ''}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <button
              type="button"
              className="btnVisibility"
              aria-label="Prikaži lozinku"
              onClick={() => setShowPassword1(!showPassword1)}
            >
              <img src={showPassword1 ? visibilityIcon : visibilityOffIcon} />
            </button>
        </div>

        <div id="pass2">
            <p className="label">Potvrdite lozinku</p>
            <input 
              type={showPassword2 ? 'text' : 'password'}
              placeholder="" 
              value={password2 || ''}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <button
              type="button"
              className="btnVisibility"
              aria-label="Prikaži lozinku"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              <img src={showPassword2 ? visibilityIcon : visibilityOffIcon} />
            </button>
        </div>

        {error && <p style={{color: 'red'}}>{error}</p>}

        <button type="submit" id="btnSubmit">Sacuvaj</button>
      </form>
    </div>
  )
}

export default EditAcc
