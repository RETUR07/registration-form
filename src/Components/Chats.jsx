import {React, useState, useEffect} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Divider from '@mui/material/Divider';

const cache = require('memory-cache');
const axios = require('axios').default;
const signalR = require('@microsoft/signalr');

export default function Chats() {
    const [content, setContent] = useState(cache.get('chats')?cache.get('chats'):[]);
    const [error, setError] = useState(false);
    const [signalRstate, setSignalRstate] = useState(true);
    const [currentChat, setCurrentChat] = useState(null);


    useEffect(() => GetChats(), []);
    useEffect(() => {
        const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5050/hubs/chats", {
        accessTokenFactory: () => localStorage.getItem("jwtToken"),
        transport: signalR.HttpTransportType.hubConnection,
      })
        .build();
        hubConnection.on('Send', (e) => {
            GetChat(currentChat.id);
        });
        hubConnection.start().catch(() => {
          setSignalRstate(false);
        });
        setSignalRstate(true);
        return () => {hubConnection.stop()}
      
    }, [signalRstate]);

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
            <List component="nav" aria-label="mailbox folders">
                {content.map((chat) => (
                    <div key={chat.id}>
                    <ListItem button onClick={() => {GetChat(chat.id)}}>
                        <ListItemText primary={chat.id} />
                    </ListItem>
                    <Divider />
                    </div>
                ))}
            </List>
            );
        }

      const ShowChat = (props) => {
        if (!props.chat)return ("nothing");
        return (
            <div>
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
                </Box>
                <List component="nav" aria-label="mailbox folders">
                    {props.chat.messages.map((message) => (
                        <div>
                        <ListItem key={message.id}>
                            <ListItemText primary={message.text} />
                        </ListItem>
                        <Divider />
                        </div>
                    ))}
                </List>
            </div>
            );
        }


        const [message, setMessage] = useState("");
        const [files, setFiles] = useState([]);


        const SendMessage = () => {
            const bodyFormData = new FormData();
            bodyFormData.append('Text', message);
            bodyFormData.append('ChatId', currentChat.id);
            for(let idx = 0; idx < files.length; idx++){
                bodyFormData.append('Content', files[idx]);
            }
            axios({
                method: 'put',
                url: 'http://localhost:5050/api/Chat/addmessage',
                headers:{
                    "Content-Type":'multipart/form-data',
                },
                data: bodyFormData,
                })
                .catch(
                    (error) => {
                      setError(true);
                      console.log(error); 
                })
        }

        const handleMessage = (e) => {
            setMessage(e.target.value);
        }
        const handleFiles = (e) => {
            setFiles(e.target.files);
        }     

    return (
        <div>    
            <ShowChats/>
            <ShowChat chat={currentChat}/>
            <div>
                <form>
                    <textarea name="Text1" cols="40" rows="5" onChange={handleMessage}></textarea>
                    <input onChange={handleFiles} className="input" type="file" multiple/>

                    <button onClick={SendMessage} type="button">
                        send
                    </button> 
                </form>
            </div>
        </div>
      );
}

