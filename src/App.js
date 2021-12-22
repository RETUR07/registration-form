import React, { useState } from 'react';
import './App.css';
import AuthForm from "./AuthForm";
import ChangeUserInfo from './ChangeUserInfo';
import CreateUserForm from './CreateUserForm';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PrivateRoute from './Guards/PrivateRoute'
import PublicRoute from './Guards/PublicRoute';


function App() {
  const [isAuthorized, setAuthorized] = useState(true);

  return(
  <Router>
    <div>
      <Link className='mylink' button to='/ChangeUserInfo'>ChangeUserInfo</Link>
      <Link className='mylink' button to='/AuthForm'>AuthForm</Link>
      <Link className='mylink' button to='/CreateUserForm'>CreateUserForm</Link>
    </div>
    <Routes>
        <Route path='/ChangeUserInfo' element={ 
        <div className='App'>
          <PrivateRoute isAuthorized={isAuthorized}>
            <ChangeUserInfo setAuthorized={setAuthorized}/>
          </PrivateRoute>
        </div>}/>
        <Route path='/AuthForm' element={
        <div className='App'>
          <PublicRoute isAuthorized={isAuthorized}>
            <AuthForm setAuthorized={setAuthorized}/>
          </PublicRoute>
        </div>}/>
        <Route path='/CreateUserForm' element={
        <div className='App'>
          <PublicRoute isAuthorized={isAuthorized}>
            <CreateUserForm/>
          </PublicRoute>
        </div>}/>
    </Routes>
  </Router>
  );
  // if(isAuthorized)
  // {
  //   return (
  //     <div>
  //       <div className="App">
  //         <ChangeUserInfo setAuthorized={setAuthorized}/>
  //       </div>
  //     </div>
  //   );
  // }
  // else 
  // if (isCreated)
  //   {
  //     return (
  //       <div>
  //         <div className="App">
  //           <AuthForm setAuthorized={setAuthorized} setCreated={setCreated}/>
  //         </div>
  //       </div>
  //     );
  //   }
  //   else{
  //     return(
  //       <div>
  //         <div className='App'>
  //           <CreateUserForm setCreated={setCreated}/>
  //         </div>
  //       </div>
  //     );
  //   }
}
  
export default App;