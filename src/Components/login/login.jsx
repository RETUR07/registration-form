import React from "react";
import loginImg from "..\\..\\login.svg";

const axios = require('axios').default;


export class Login extends React.Component{
    constructor(props, func){
        super(props);
        this.state = {
            name: " ",
            password: " ",
            error: " ",
        };
        this.setAuthorized = () => {func()};
    }

    setAuthorized;
    handleName(e){
        this.setState((x) => ({ 
            name: e.target.value,
            password: x.password,
            error: x.error,
         }));
    };
    handlePassword(e){
        this.setState((x) => ({ 
            name: x.name,
            password: e.target.value,
            error: x.error,
        }));
    };
    handleSubmit(e){
        e.preventDefault();
        if (this.state.name === '' || this.state.password === '') {
          return;
        } 
        else {
            axios({
                method: 'post',
                url: 'http://localhost:5050/api/Authorization/authenticate',
                data:{   
                "username": this.state.name,
                "password": this.state.password 
                }
            })
            .catch(
                function(error) {
                console.log(error);
                localStorage.setItem("jwtToken", "");
                localStorage.setItem("userId", "");
            })
            .then(
                function (response) {
                if(response)
                {
                    localStorage.setItem("jwtToken", response.data.jwtToken);
                    localStorage.setItem("userId", response.data.id);
                }
            })
            this.setAuthorized();
        }
    };
    render(){
        return <div className="base-container" ref={this.props.containerRef}>
            <div className="header">Login</div>
            <div className="content">
                <div className="image">
                    <img src={loginImg} />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input name="username" type="text" placeholder="username" onChange={this.handleName.bind(this)}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input name="password" type="password" placeholder="password" onChange={this.handlePassword.bind(this)}></input>
                    </div>
                </div> 
            </div>
            <div className="footer">
                <button type="button" className="btn" onClick={this.handleSubmit.bind(this)}>Login</button>
            </div>
        </div>
    }
}