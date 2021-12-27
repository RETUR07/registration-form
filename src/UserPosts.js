import React, { useState, useEffect, useContext } from 'react';
import Context from './Contexts/Context';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const axios = require('axios').default;
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
  return config;
}, function (error) {
  return Promise.reject(error);
});



export default function UserPosts() {

    const [content, setContent] = useState(JSON.parse(sessionStorage.getItem("loadedPosts")));
    const [error, setError] = useState(false);
    const {RotateJWT} = useContext(Context);

    useEffect(() => {
        if(content === "" || content === null)GetContent();
      });

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

    const ShowContent = (content) => {
      return (
        <Container maxWidth="sm">
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {content.map((file) => 
            <ImageListItem key={file.fileDownloadName}>
              <img src={`data:${file.contentType}};base64,${file.fileContents}`} width="50%" height="50%" alt={file.fileDownloadName}/>
            </ImageListItem>
          )}
        </ImageList>
        </Container>
      );
    }
    const ShowPosts = () => {
        return (
          <Container maxWidth="sm">
            <ol className='list'>
                {content.map((post) => (
                  <li key={post.id}>
                    <Container maxWidth="sm">
                    <div>
                      <h3>{post.header}</h3>
                      <h5>{post.text}</h5>
                    </div>
                    <div>
                      {ShowContent(post.content)}
                    </div>
                    </Container>
                  </li>
                ))}
            </ol>
            </Container>
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
                  sessionStorage.setItem("loadedPosts", JSON.stringify(response.data));
                  setContent(response.data);
                }
                else
                {
                    setError(true);
                }
            })
            .catch(
                (error) => {
                 RotateJWT();
            });
    }


    if(content)
    {
    
    return (
      <div>
        <button onClick={GetContent} className="btn" type="button">
          update
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