import React, { useState, useEffect, useContext } from 'react';
import Context from '../Contexts/Context';

const axios = require('axios').default;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
  return config;
}, function (error) {
  return Promise.reject(error);
});



export default function ChangeUserInfo() {

    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [error, setError] = useState(false);
    const {RotateJWT} = useContext(Context);

    useEffect(() => {
        if(!user)GetUser();
      });

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
        user.firstName = e.target.value;
        setLastName(user.lastName);
        setDateOfBirth(new Date(user.dateOfBirth));
      };
    
    const handleLastName = (e) => {
        setLastName(e.target.value);
        user.lastName = e.target.value;
        setFirstName(user.firstName);
        setDateOfBirth(new Date(user.dateOfBirth));
      };
    
    const handleDateOfBirth = (e) => {
        setDateOfBirth(new Date(e.target.value));
        user.dateOfBirth = new Date(e.target.value);
        setLastName(user.lastName);
        setFirstName(user.firstName);
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (firstName === '' || lastName === '' || dateOfBirth === '') {
          setError(true);
        } 
        else {
        axios({
          method: 'put',
          url: 'http://localhost:5050/api/User/',
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
            <h1>You did no changes</h1>
          </div>
        );
      };

    const GetUser = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5050/api/user/info',
            })
            .then(
            (response) => {
                if(response.data)
                {
                    setUser(response.data);
                }
            })
            .catch(
                (error) => {
                  RotateJWT();
            });
    }
    if(user)
    {
    const date = new Date(user.dateOfBirth);
    const datevalue = date.getFullYear() + '-' + (new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 2 }).format(date.getMonth() + 1)) + '-' + (new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 2 }).format(date.getDate()));

    return (
      <div className="form">
        <div>
          <h1>{user.userName}</h1>
        </div>
    
        <div className="messages">
          {errorMessage()}
        </div>
    
        <form>
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
      </div>
    );
    }
    else
    {
        return(
            <div>
                <label>Loading...</label>
            </div>
        );
    }
}