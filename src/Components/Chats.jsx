import {React, useState, useEffect} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ShowChat from "./ShowChat";
import ConfirmationDialog from "./AddChatDialog"
import Container from '@mui/material/Container';

const cache = require('memory-cache');
const axios = require('axios').default;

export default function Chats() {
    const [content, setContent] = useState(cache.get('chats')?cache.get('chats'):[]);
    const [error, setError] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    
    useEffect(() => GetChats(), []);

    const GetChats = () => {
        axios({
          method: 'get',
          url: 'http://localhost:5050/api/Chat/chats',
          })
          .then(
          (response) => {
              if(response.data && response.data.length !== 0)
              {
                cache.put('chats', response.data, 300000);
                setContent(response.data);
                setError(false);
              }
          })
          .catch(
              (error) => {
                setError(true);
                console.log(error); 
          })
      };

      const GetChat = (chatId) => {
        const params = new URLSearchParams({
            PageNumber: 1,
            PageSize: 10,
          }).toString();
        axios({
          method: 'get',
          url: 'http://localhost:5050/api/Chat/' + chatId,
          })
          .then(
          (response) => {
              if(response.data)
              {
                  setCurrentChat(response.data);
              }
          })
          .catch(
              (error) => {
                setError(true);
                console.log(error); 
          })
      };

      const ShowChats = () => {
        return (
            <List sx={{
                width: '100%',
                overflow: 'auto',
                maxHeight: window.innerHeight * 0.75,
            }} component="nav" aria-label="mailbox folders">
                {content.map((chat) => (
                    <div key={chat.id}>
                    <ListItem button onClick={() => {GetChat(chat.id)}}>
                        <ListItemText primary={chat.id} />
                    </ListItem>
                    <Divider />
                    </div>
                ))}
                <ListItem>
                    <ConfirmationDialog />
                </ListItem>
            </List>
            );
        }

      const ShowChatUsers = (props) => {
          if (!props.chat)return null;
          return(
            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {props.chat.users.map((user) => (
                <SpeedDialAction
                    key={user}
                    icon={user}
                    tooltipTitle={user}
                />
                ))}
            </SpeedDial>
            </Box>);
      }

    return (
        <div>
        <Container maxWidth="sm" >   
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <ShowChats/>
                </Grid>

                <Grid item xs={8}>
                    <ShowChat setChat={setCurrentChat} chat={currentChat}/>
                </Grid>

                <Grid item xs={1}>
                    <ShowChatUsers chat={currentChat}/>
                </Grid>
            </Grid>
        </Container>
        </div>
      );
}

