
import './App.css';
import AuthForm from "./AuthForm";
import ChangeUserInfo from './ChangeUserInfo';
import CreateUserForm from './CreateUserForm';
import { useState } from 'react';


function App() {
  const [isAuthorized, setAuthorized] = useState(false);
  const [isCreated, setCreated] = useState(true);

  if(isAuthorized)
  {
    return (
      <div>
        <div className="App">
          <ChangeUserInfo setAuthorized={setAuthorized}/>
        </div>
      </div>
    );
  }
  else 
  if (isCreated)
    {
      return (
        <div>
          <div className="App">
            <AuthForm setAuthorized={setAuthorized} setCreated={setCreated}/>
          </div>
        </div>
      );
    }
    else{
      return(
        <div>
          <div className='App'>
            <CreateUserForm setCreated={setCreated}/>
          </div>
        </div>
      );
    }
}
  
export default App;