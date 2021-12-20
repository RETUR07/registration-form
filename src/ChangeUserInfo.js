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

    const LogOut = () => {
        localStorage.setItem("jwtToken", "");
        localStorage.setItem("userId", "");
        props.setAuthorized(false);
    }

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
            setUser(JSON.stringify(response.data));
        }
        else{
            props.setAuthorized(false);
        }
    })
    

    return (
        <div>
            <div>
                {user} 
            </div>         
            <button onClick={LogOut} className="btn" type="submit">
                log out
            </button>
        </div>
    );
}