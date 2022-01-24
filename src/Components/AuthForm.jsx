import React, { useState, useContext } from 'react';
import Context from '../Contexts/Context';
import Button from '@mui/material/Button';

const axios = require('axios').default;

export default function AuthForm() {
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { setAuthorized } = useContext(Context);

  // Handling the name change
  const handleName = (e) => {
    setName(e.target.value);
  };
  
  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  
  // Handling the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === '' || password === '') {
      setError(true);
    } 
    else {
    const data = new URLSearchParams();
    data.append('client_id', "client");
    data.append('scope', "offline_access SocialNetwork");
    data.append('username', name);
    data.append('password', password);
    data.append('client_secret', "secret");
    data.append('grant_type', "password");
    axios({
      method: 'post',
      url: 'https://localhost:9001/connect/token',
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data:data,
    })
    .catch(
      function(error) {
      console.log(error);
      localStorage.setItem("jwtToken", "");
      localStorage.setItem("refreshToken", "");
    })
    .then(
       (response) => {
        if(response)
        {
          localStorage.setItem("jwtToken", response.data.access_token);
          localStorage.setItem("refreshToken", response.data.refresh_token);
          setAuthorized(true);     
        }
    })

    setError(false);
    }
  };
  
  // Showing error message if error is true
  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>Please enter all the fields</h1>
      </div>
    );
  };
  
  return (
    <div>
      <div className="form">
        <div>
          <h1>User Authorization</h1>
        </div>
    
        {/* Calling to the methods */}
        <div className="messages">
          {errorMessage()}
        </div>
    
        <form>

          {/* Labels and inputs for form data */}
          <label className="label">Username</label>
          <input onChange={handleName} className="input" 
            value={name} type="text" />
    
          <label className="label">Password</label>
          <input onChange={handlePassword} className="input" 
            value={password} type="password" />
          <Button class='mybtn' variant="contained" onClick={handleSubmit} type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}