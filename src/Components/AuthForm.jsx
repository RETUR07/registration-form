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
    axios({
      method: 'post',
      url: 'http://localhost:5050/api/Authorization/authenticate',
      data:{   
        "username": name,
        "password": password 
      }
    })
    .catch(
      function(error) {
      console.log(error);
      localStorage.setItem("jwtToken", "");
      localStorage.setItem("refreshToken", "");
    })
    .then(
      function (response) {
        if(response)
        {
          localStorage.setItem("jwtToken", response.data.jwtToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          setAuthorized(true);
          axios({
            method: 'post',
            url: 'http://localhost:5050/api/Authorization/refresh-token',
            headers:{
              "Content-Type": "application/json"
            },
            data: `${localStorage.getItem("refreshToken")}`,
        })
        .catch(
            (error) => {
            console.log(error);
            setAuthorized(false);
        })
        .then(
            (response) => {
            if(response)
            {
                localStorage.setItem("jwtToken", response.data.jwtToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                setAuthorized(true);
            }
        });
        
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