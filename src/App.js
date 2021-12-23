import React, { useState } from 'react';
import './App.css';
import AuthForm from "./AuthForm";
import ChangeUserInfo from './ChangeUserInfo';
import CreateUserForm from './CreateUserForm';
import UserPosts from './UserPosts';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PrivateRoute from './Guards/PrivateRoute';
import PublicRoute from './Guards/PublicRoute';
import Context from './Contexts/Context';


function App() {
  const [isAuthorized, setAuthorized] = useState(true);

  return(
  <Router>
    <div>
      <Link className='mylink' to='/'>Main</Link>
      <Link className='mylink' to='/ChangeUserInfo'>ChangeUserInfo</Link>
      <Link className='mylink' to='/AuthForm'>AuthForm</Link>
      <Link className='mylink' to='/CreateUserForm'>CreateUserForm</Link>
    </div>
    <Context.Provider value={{isAuthorized, setAuthorized}}>
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