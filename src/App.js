import React from 'react';
import './App.scss';
import { Login, Register } from ".\\Components\\login\\index"

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isLogginActive: true,
      isAuthorized: false,
    }
  }

changeState() {
  const { isLogginActive } = this.state;
  if(isLogginActive) {
    this.rightSide.classList.remove("right");
    this.rightSide.classList.add("left");
  }
  else {
    this.rightSide.classList.remove("left");
    this.rightSide.classList.add("right");
  }

  this.setState( (prevState) => ({isLogginActive: !prevState.isLogginActive}));
}

setAuthorized()
{
  this.setState( (prevState) => ({isAuthorized: true,}));
}


  render() {
    const { isLogginActive, isAuthorized } = this.state;
    const current = isLogginActive ? "Login" : "Register";

    return (
      <div className="App">
        <div className="login">
          <div className="container">
            {isLogginActive && !isAuthorized && <Login containerRef={ (ref) => this.current = ref}/>}
            {!isLogginActive && !isAuthorized && <Register setAuthorized={this.setAuthorized.bind(this)} containerRef={ (ref) => this.current = ref}/>}
          </div>
          <RightSide current={current} containerRef={ (ref) => this.rightSide = ref} onClick={this.changeState.bind(this)}/>
        </div>
      </div>
    );
  }
}

const RightSide = props => {
  return (<div className="right-side" ref={props.containerRef} onClick={props.onClick}>
    <div className='inner-container'>
      <div className="text">{props.current}</div>
    </div>
  </div>)
}

export default App;