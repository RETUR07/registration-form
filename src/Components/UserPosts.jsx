import React, { useState } from 'react';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import FavoriteIcon from '@mui/icons-material/Favorite';

import useInView from "react-cool-inview";


const cache = require('memory-cache');
const axios = require('axios').default;



export default function UserPosts() {

    const [content, setContent] = useState(cache.get('posts')?cache.get('posts'):[]);
    const [likes, setLikes] = useState(cache.get('likes')?cache.get('likes'):[]);
    const [error, setError] = useState(false);
    const [currentPage, setPage] = useState(cache.get('lastLoadedPage')?(cache.get('lastLoadedPage')+1):1);

    const { observe } = useInView({
      // For better UX, we can grow the root margin so the data will be loaded earlier
      rootMargin: "100px 0px",
      // When the last item comes to the viewport
      onEnter: ({ unobserve, observe }) => {
        // Pause observe when loading data
        unobserve();
        // Load more data
        const params = new URLSearchParams({
          PageNumber: currentPage,
          PageSize: 4,
        }).toString();

        axios({
            method: 'get',
            url: 'http://localhost:5050/api/Post/childposts/1?' + params,
            })
            .then(
            (response) => {
                if(response.data && response.data.length !== 0)
                {
                  const newContent = content.concat(response.data);
                  cache.put('posts', newContent, 300000);
                  cache.put('lastLoadedPage', currentPage, 300000);
                  setContent(newContent);
                  setPage(currentPage + 1);
                  setError(false);
                  const rateParams = new URLSearchParams();

                  for(let idx = 0; idx < newContent.length; idx++){
                    rateParams.append("postIDs", newContent[idx].id);            
                  }
                  axios({
                    method: 'get',
                    url: 'http://localhost:5050/api/Rate/posts?' + rateParams.toString(),
                    })
                    .then(
                    (response) => {
                        if(response.data && response.data.length !== 0)
                        {
                          cache.put('likes', response.data, 300000);
                          setLikes(response.data);
                          setError(false);
                          observe();
                        }
                    })
                    .catch(
                        (error) => {
                          setError(true);
                          console.log(error); 
                    });
                }
            })
            .catch(
                (error) => {
                  setError(true);
                  console.log(error); 
                   });

      },
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

    const ShowLikes = (params) => {
      const likeValue = (likes.find((x) => x.find(y => y.postId === params.postId)));
      const output = likeValue?likeValue.length:0;
        return (
          <div>
            {output} 
            <FavoriteIcon/>
          </div>
          );
    }

    const ShowContent = (content) => {
      return (
        <Container maxWidth="sm">
        <ImageList sx={{ width: 350, height: 450 }} cols={3} rowHeight={164}>
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
                     <Card sx={{ maxWidth: 400, m: 2 }}>
                        <CardHeader title={ post.header } />
                        { ShowContent(post.content) }
                        <CardContent>
                          {
                            <Typography variant="body1" align='left' gutterBottom component="div">
                              {
                                post.text
                              }
                            </Typography>
                          }
                          <ShowLikes postId={post.id}/>
                        </CardContent>
                      </Card>
                  </li>
                ))}
            </ol>
            <div ref={observe}></div>
            </Container>
            );
    }
        

    const [title, setTitle] = useState('');
    const [files, setFiles] = useState([]);
    const [text, setText] = useState('');

    const handleTitle = (e) => {
      setTitle(e.target.value);
    }

    const handleFiles = (e) => {
      setFiles(e.target.files);
      console.log(e.target.files);
    }

    const handleText = (e) => {
      setText(e.target.value);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
        if (title === '') {
          setError(true);
        } 
        else {
        const bodyFormData = new FormData();
        bodyFormData.append('Header', title);
        bodyFormData.append('ParentPostId', 1);
        bodyFormData.append('Text', text);
        console.log(files);
        for(let idx = 0; idx < files.length; idx++){
          bodyFormData.append('Content', files[idx]);
        }

        axios({
          method: 'post',
          url: 'http://localhost:5050/api/Post',
          headers:{
            "Content-Type":'multipart/form-data',
          },
          data: bodyFormData,
        })
        .catch(
          (error) => {
            console.log(error);
          })    
        }
        setError(false);
    }

    if(content)
    {
      console.log("something");
    return (
      <div>
        <Box sx={{ '& button': { m: 2 } }}>
        <Button variant='contained' onClick={() => 
          { 
            cache.clear();
            setContent([]);
            setLikes([]);
            setPage(1);
            }} class="mybtn" type="button">
          Update
        </Button>
        </Box>
        <div className="messages">
          {errorMessage()}
        </div>
        <Container maxWidth="sm">
        <form>
          <Card sx={{ maxWidth: 400, m: 2 }}>
            <CardHeader title='Create post'/>
            
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <label>Title</label>
                <input onChange={handleTitle} className="input" type="text"/>
                <label>Files</label>
                <input onChange={handleFiles} className="input" type="file" multiple/>
                <label>Text</label>
                <Typography variant="body1" component="div">                 
                <textarea name="Text1" cols="40" rows="5" onChange={handleText}></textarea>              
                </Typography>
              </Box>
              

              
            </CardContent>
            <button onClick={handleSubmit} className="btn" type="submit">
              Create
            </button> 
          </Card>
        </form>
        </Container>
        <ShowPosts />     
        <Container maxWidth="sm">
              <Card sx={{ maxWidth: 400, m: 2 }}>
                <CardHeader
                  title={
                      <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                      />
                  }
                />
                <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
                <CardContent>
                    <React.Fragment>
                      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                      <Skeleton animation="wave" height={10} width="80%" />
                    </React.Fragment>
                </CardContent>
              </Card>
            </Container>   
      </div>
    );
    }
    else
    {
        return(
            <Container maxWidth="sm">
              <Card sx={{ maxWidth: 400, m: 2 }}>
                <CardHeader
                  title={
                      <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                      />
                  }
                />
                <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />

                <CardContent>
                    <React.Fragment>
                      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                      <Skeleton animation="wave" height={10} width="80%" />
                    </React.Fragment>
                </CardContent>
              </Card>
            </Container>
        );
    }
}