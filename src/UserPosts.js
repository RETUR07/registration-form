import React, { useState, useEffect, useContext } from 'react';
import Context from './Contexts/Context';

const axios = require('axios').default;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
  return config;
}, function (error) {
  return Promise.reject(error);
});



export default function UserPosts() {

    const [content, setContent] = useState(null);
    const [error, setError] = useState(false);
    const {setAuthorized} = useContext(Context);

    useEffect(() => {
        if(!content)GetContent();
      });


    const LogOut = () => {
        localStorage.setItem("jwtToken", "");
        setAuthorized(false);
    }

      const errorMessage = () => {
        return (
          <div
            className="error"
            style={{
              display: error ? '' : 'none',
            }}>
            <h1>error loading</h1>
          </div>
        );
      };

    const ShowPosts = () => {
        return (
            <ol>
                {content.map((post) => <li key={post.id}>{post.header}</li>)}
            </ol>  
            );
    }


    const GetContent = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5050/api/Post/childposts/1',
            })
            .then(
            (response) => {
                if(response.data)
                {
                    console.log(response.data);
                    setContent(response.data);
                }
                else
                {
                    setError();
                }
            })
            .catch(
                (error) => {
                    console.log(error);
                    LogOut();   
            });
    }


    if(content)
    {
    
    return (
      <div>
        <button onClick={LogOut} className="btn" type="submit">
            log out
        </button>
        <div className="messages">
          {errorMessage()}
        </div>
        <ShowPosts />     
      </div>
    );
    }
    else
    {
        return(
            <div>
                <label>Loading...</label>
            </div>
        );
    }
}