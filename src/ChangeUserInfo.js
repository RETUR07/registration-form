import React, { useState } from 'react';

const axios = require('axios').default;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
  return config;
}, function (error) {
  return Promise.reject(error);
});



export default function ChangeUserInfo(props) {

    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [error, setError] = useState(false);

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
        user.firstName = e.target.value;
      };
    
    const handleLastName = (e) => {
        setLastName(e.target.value);
        user.lastName = e.target.value;
      };
    
    const handleDateOfBirth = (e) => {
        setDateOfBirth(e.target.value);
        user.dateOfBirth = e.target.value;
      };

    const LogOut = () => {
        localStorage.setItem("jwtToken", "");
        localStorage.setItem("userId", "");
        props.setAuthorized(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (firstName === '' || lastName === '' || dateOfBirth === '') {
          setError(true);
        } 
        else {
        axios({
          method: 'put',
          url: 'http://localhost:5050/api/User/' + user.id,
          data:{   
            "firstName": firstName,
            "lastName": lastName,
            "dateOfBirth": dateOfBirth,
          }
        })
        .catch(
          function(error) {
            console.log(error);
        })
        .then(
          function (response) {
            setUser(null);
        })
    
        }
      };

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

    if(!user)
    axios({
    method: 'get',
    url: 'http://localhost:5050/api/user/'+ localStorage.getItem("userId"),
    })
    .catch(
    function(error) {
    console.log(error)
    localStorage.setItem("jwtToken", "");
    localStorage.setItem("userId", "");
    props.setAuthorized(false);
    })
    .then(
    function (response) {
        if(response)
        {
            setUser(response.data);
        }
        else{
            props.setAuthorized(false);
        }
    })
    if(user)
    {
    const date = new Date(user.dateOfBirth);
    const datevalue = date.getFullYear() + '-' + (new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 2 }).format(date.getMonth() + 1)) + '-' + (new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 2 }).format(date.getDate()));

    return (
      <div className="form">
        <div>
          <h1>{user.userName}</h1>
        </div>
    
        {/* Calling to the methods */}
        <div className="messages">
          {errorMessage()}
        </div>
    
        <form>
          {/* Labels and inputs for form data */}
          <label className="label">First name</label>
          <input onChange={handleFirstName} className="input" 
             type="text" value={user.firstName}/>

          <label className="label">Last name</label>
          <input onChange={handleLastName} className="input" 
            type="text" value={user.lastName}/>
    
          <label className="label">Date of birth</label>
          <input onChange={handleDateOfBirth} className="input" 
             type="date" value={datevalue}/>
    
          <button onClick={handleSubmit} className="btn" type="submit">
            Submit
          </button>
        </form>
        <button onClick={LogOut} className="btn" type="submit">
            log out
        </button>
      </div>
    );
    }
    else
    return(
        <div>
            Loading...
        </div>
    );
}