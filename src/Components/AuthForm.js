import React, { useState, useContext } from 'react';
import Context from '../Contexts/Context';
import Button from '@mui/material/Button';

const axios = require('axios').default;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
  return config;
}, function (error) {
  return Promise.reject(error);
});


export default function AuthForm() {
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const {setAuthorized} = useContext(Context);

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
      localStorage.setItem("userId", "");
    })
    .then(
      function (response) {
        if(response)
        {
          localStorage.setItem("jwtToken", response.data.jwtToken);
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