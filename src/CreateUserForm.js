import React, { useState } from 'react';


const axios = require('axios').default;

export default function AuthForm() {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  // Handling the name change
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleDateOfBirth = (e) => {
    setDateOfBirth(e.target.value);
  };
  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  
  // Handling the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setError(true);
    } 
    else {
    axios({
      method: 'post',
      url: 'http://localhost:5050/api/User',
      data:{   
        "firstName": firstName,
        "lastName": lastName,
        "username": username,
        "dateOfBirth": dateOfBirth,
        "password": password
      }
    })
    .catch(
      function(error) {
        console.log(error);
    })
    .then(
      function (response) {
        if(response)
        {
          localStorage.setItem("userId", response.data);
          window.location.reload();
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
          <label className="label">First name</label>
          <input onChange={handleFirstName} className="input" 
            value={firstName} type="text" />

          <label className="label">Last name</label>
          <input onChange={handleLastName} className="input" 
            value={lastName} type="text" />

          <label className="label">Username</label>
          <input onChange={handleUsername} className="input" 
            value={username} type="text" />
    
          <label className="label">Date of birth</label>
          <input onChange={handleDateOfBirth} className="input" 
            value={dateOfBirth} type="date" />
        
          <label className="label">Password</label>
          <input onChange={handlePassword} className="input" 
            value={password} type="password" />
    
          <button onClick={handleSubmit} className="btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}