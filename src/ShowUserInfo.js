import React, { useState } from 'react';
import AuthForm from "./AuthForm"

const axios = require('axios').default;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default function ShowUserInfo() {
  const [user, setUser] = useState(null);

  const getUserInfo = () => {
     axios({
      method: 'get',
      url: 'http://localhost:5050/api/user/'+ localStorage.getItem("userId"),
    })
    .catch(
      function(error) {
      console.log(error)
      localStorage.setItem("jwtToken", "");
      localStorage.setItem("userId", "");
    })
    .then(
      function (response) {
        if(response)
        {
          setUser(JSON.stringify(response.data));
        }
      })
  }

  const LogOut = () => {
    localStorage.setItem("jwtToken", "");
    localStorage.setItem("userId", "");
    window.location.reload();
  }
  getUserInfo();
  if(user)
  {
    return (
      <div>
        <div className="App">
          {user}
        </div>
        <button onClick={LogOut} className="btn" type="submit">
          log out
        </button>
      </div>
    );
  }
  else
  {
    return (
        <div>{AuthForm()}</div>
      );
  }
}