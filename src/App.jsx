import { useState } from 'react';
import './App.css';
import Authorization from './Authorization/Authorization';
import AuthForm from "./Components/AuthForm.jsx";
import ChangeUserInfo from './Components/ChangeUserInfo.jsx';
import CreateUserForm from './Components/CreateUserForm.jsx';
import UserPosts from './Components/UserPosts.jsx';
import Chats from './Components/Chats';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PrivateRoute from './Guards/PrivateRoute';
import PublicRoute from './Guards/PublicRoute';
import Context from './Contexts/Context';
import Button from '@mui/material/Button';

const cache = require('memory-cache');


function App() {

  const [isAuthorized, setAuthorized] = useState(true);

  const LogOut = () => {
    cache.clear();
    localStorage.setItem("jwtToken", "");
    localStorage.setItem("refreshToken", "");
    setAuthorized(false);
  }

  return(
<Context.Provider value={{isAuthorized, setAuthorized}}>
  <Authorization/>
  <Router>
    <div>
      <Link className='mylink' to='/'>Main</Link>
      <Link className='mylink' to='/ChangeUserInfo'>ChangeUserInfo</Link>
      <Link className='mylink' to='/Chats'>Chats</Link>
      <Link className='mylink' to='/AuthForm'>AuthForm</Link>
      <Link className='mylink' to='/CreateUserForm'>CreateUserForm</Link>
    </div>
    <Routes>
        <Route path='/' element={ 
        <div className='App'>
          <PrivateRoute>
            <UserPosts/>
          </PrivateRoute>
        </div>}/>
        <Route path='/ChangeUserInfo' element={ 
        <div className='App'>
          <PrivateRoute>
            <Button variant='contained' onClick={LogOut} class="mybtn" type="submit">
              log out
            </Button>
            <ChangeUserInfo/>
          </PrivateRoute>
        </div>}/>
        <Route path='/Chats' element={ 
        <div className='App'>
          <PrivateRoute>
            <Chats/>
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
  </Router>
</Context.Provider>
  );
}

export default App;