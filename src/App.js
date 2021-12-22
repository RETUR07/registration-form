
import './App.css';
import AuthForm from "./AuthForm";
import ChangeUserInfo from './ChangeUserInfo';
import CreateUserForm from './CreateUserForm';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';


function App() {
  const [isAuthorized, setAuthorized] = useState(true);

  function PrivateRoute({ children }) {
    const auth = isAuthorized;
    return auth ? children : <Navigate to="/AuthForm" />;
  }

  function PublicRoute({ children }) {
    const auth = isAuthorized;
    return !auth ? children : <Navigate to="/ChangeUserInfo" />;
  }

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
          <PrivateRoute>
            <ChangeUserInfo setAuthorized={setAuthorized}/>
          </PrivateRoute>
        </div>}/>
        <Route path='/AuthForm' element={
        <div className='App'>
          <PublicRoute>
            <AuthForm setAuthorized={setAuthorized}/>
          </PublicRoute>
        </div>}/>
        <Route path='/CreateUserForm' element={
        <div className='App'>
          <PublicRoute>
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