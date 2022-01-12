import {React, useState, useEffect, createRef} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SendMessageForm from "./SendMessage";
import Typography from '@mui/material/Typography';

const signalR = require('@microsoft/signalr');

export default function ShowChat(props) {
    const [signalRhub, setSignalR] = useState(null);
    const [signalRState, setSignalRState] = useState(true);
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        if (props.chat)
            setMessages(props.chat.messages);
    }, [props]);

    useEffect(() => {
        if (props.chat){
            const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5050/hubs/chats", {
            accessTokenFactory: () => localStorage.getItem("jwtToken"),
            transport: signalR.HttpTransportType.hubConnection,
            })
            .build();
            hubConnection.on('MessageChanged', (e) => {
                setMessages(messages.concat(e));
            });
            hubConnection.on('Notify', (e) => {
                console.log(e);
            });
            hubConnection.start()
            .then(() =>  
            {
                hubConnection.invoke("Subscribe", props.chat.id).catch((e) => {
                    console.log(e);
                });
                setSignalR(hubConnection);
                setSignalRState(true);
            }).catch(() => {
                setSignalRState(false);
            });
            return () => {hubConnection.stop()}
    }
      
    }, [signalRState, props]);


      const ShowContent = (content) => {
        if(!content || content.length === 0)return null;
        return (
            <Container maxWidth="sm">
            <ImageList sx={{ width: "100%"}} cols={3} rowHeight={164}>
            {content.map((file) => 
                <ImageListItem key={file}>
                <img src={file + "?access_token=" + localStorage.getItem("jwtToken")} width="100%" height="100%" alt={file}/>
                </ImageListItem>
            )}
            </ImageList>
            </Container>
        );
        }


    const ShowMessages = (props) => {
        const messagesEndRef = createRef();

      useEffect(() => {
          if(messagesEndRef.current)
        messagesEndRef.current.scrollIntoView({ block: "end"});
      }, [messages]);  
        return (
            <List sx={{
                width: '100%',
                overflow: 'auto',
                maxHeight: window.innerHeight * 0.75,
            }} component="nav" aria-label="mailbox folders" >
            {props.messages.map((message) => (
                <div key={message.id}>
                <ListItem>
                <Card sx={{ maxWidth: "100%" }}>
                <CardContent>
                    <Typography sx={{ maxWidth: "100%" }} variant="h5" component="div">
                        {message.from}
                    </Typography>

                    <Typography sx={{ maxWidth: "100%" }} variant="body2" >
                        {message.text}
                    </Typography>

                    {ShowContent(message.content)}
                </CardContent>
                </Card>
                </ListItem>
                <Divider />
                </div>
            ))}
            <ListItem ref={messagesEndRef}/>
        </List>
        );
    }
      if (!props.chat)return null;
        return (
            <div>
                <ShowMessages messages={messages} />
                <SendMessageForm signalRhub={signalRhub} chatId={props.chat.id}/>
            </div>
            );
}