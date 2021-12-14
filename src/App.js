
import './App.css';
import AuthForm from "./AuthForm"
import { useState } from 'react';

const axios = require('axios').default;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
  return config;
}, function (error) {
  return Promise.reject(error);
});

function App() {
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
      <div>
        <div className="App">
          <AuthForm />
        </div>
        {getUserInfo()}
      </div>
    );
  }
}
  
export default App;