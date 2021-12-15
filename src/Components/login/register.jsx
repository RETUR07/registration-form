import React from "react";
import loginImg from "..\\..\\login.svg";

export class Register extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <div className="base-container" ref={this.props.containerRef}>
            <div className="header">Register</div>
            <div className="content">
                <div className="image">
                    <img src={loginImg} />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="firstName">First name</label>
                        <input name="firstName" type="text" placeholder="first name"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last name</label>
                        <input name="lastname" type="text" placeholder="last name"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input name="username" type="text" placeholder="username"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of birth</label>
                        <input name="dateOfBirth" type="date" placeholder="__.__.____"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input name="password" type="text" placeholder="password"></input>
                    </div>
                </div> 
            </div>
            <div className="footer">
                <button type="button" className="btn">Register</button>
            </div>
        </div>
    }
}