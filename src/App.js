import React, { useState } from 'react';
import './App.css';
import AuthForm from "./Components/AuthForm";
import ChangeUserInfo from './Components/ChangeUserInfo';
import CreateUserForm from './Components/CreateUserForm';
import UserPosts from './Components/UserPosts';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PrivateRoute from './Guards/PrivateRoute';
import PublicRoute from './Guards/PublicRoute';
import Context from './Contexts/Context';
import Button from '@mui/material/Button';

const axios = require('axios').default;
const cache = require('memory-cache');


function App() {
  const [isAuthorized, setAuthorized] = useState(true);

  const RotateJWT = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5050/api/Authorization/refresh-token',
    })
    .catch(
      function(error) {
      console.log(error);
      LogOut();
    })
    .then(
      function (response) {
        if(response)
        {
          localStorage.setItem("jwtToken", response.data.jwtToken);
          setAuthorized(true);
        }
    })
  }

  const LogOut = () => {
    cache.clear();
    localStorage.setItem("jwtToken", "");
    setAuthorized(false);
  }

  return(
  <Router>
    <div>
      <Link className='mylink' to='/'>Main</Link>
      <Link className='mylink' to='/ChangeUserInfo'>ChangeUserInfo</Link>
      <Link className='mylink' to='/AuthForm'>AuthForm</Link>
      <Link className='mylink' to='/CreateUserForm'>CreateUserForm</Link>
    </div>
    <Context.Provider value={{isAuthorized, setAuthorized, RotateJWT}}>
    <Routes>
        <Route path='/' element={ 
        <div className='App'>
          <PrivateRoute>
            <Button variant='contained' onClick={LogOut} class="mybtn" type="submit">
              log out
            </Button>
            <UserPosts/>
          </PrivateRoute>
        </div>}/>
        <Route path='/ChangeUserInfo' element={ 
        <div className='App'>
          <PrivateRoute>
            <button onClick={LogOut} className="btn" type="submit">
              log out
            </button>
            <ChangeUserInfo/>
          </PrivateRoute>
        </div>}/>
        <Route path='/AuthForm' element={
        <div className='App'>
          <PublicRoute>
            <AuthForm/>
          </PublicRoute>
        </div>}/>
        <Route path='/CreateUserForm' element={
        <div className='App'>
          <PublicRoute >
            <CreateUserForm/>
          </PublicRoute>
        </div>}/>
    </Routes>
    </Context.Provider>
  </Router>
  );
}

export default App;