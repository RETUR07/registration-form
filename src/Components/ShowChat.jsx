import {React, useState, useEffect, createRef} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const signalR = require('@microsoft/signalr');

export default function ShowChat(props) {
    const [signalRhub, setSignalR] = useState(null);
    const [signalRState, setSignalRState] = useState(true);
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
    const [newMessages, setNewMessages] = useState([]);

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }
    const handleFiles = (e) => {
        setFiles(e.target.files);
    }

    
    useEffect(() => {
        if (props.chat){
            const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5050/hubs/chats", {
            accessTokenFactory: () => localStorage.getItem("jwtToken"),
            transport: signalR.HttpTransportType.hubConnection,
            })
            .build();
            hubConnection.on('Send', (e) => {
                console.log(e);
                props.GetChat(props.chat.id);
            });
            hubConnection.on('Notify', (e) => {
                console.log(e);
            });
            hubConnection.start()
            .then(() =>  
            {
                hubConnection.invoke("Subscribe", props.chat.id);
                setSignalR(hubConnection);
                setSignalRState(true);
            }).catch(() => {
                setSignalRState(false);
            });
            return () => {hubConnection.stop()}
    }
      
    }, [signalRState, props]);

      const messagesEndRef = createRef()
      useEffect(() => {
        if(props.chat)
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: "end"})
      }, [props.chat]);  

      const SendMessage = () => {
        let data = {};
        data["Text"] = message;
        data["ChatId"] = props.chat.id;
        data["Content"] = [];
        for(let idx = 0; idx < files.length; idx++){
            data["Content"].append(files[idx]);
        }
        signalRhub.invoke("AddMessage", data);
        }

      if (!props.chat)return null;
        return (
            <div>
                <List sx={{
                        width: '100%',
                        overflow: 'auto',
                        maxHeight: window.innerHeight * 0.75,
                    }} component="nav" aria-label="mailbox folders" >
                    {(props.chat.messages.concat(newMessages)).map((message) => (
                        <div>
                        <ListItem key={message.id}>
                            <ListItemText primary={
                            <div>
                                <h4>{message.from}</h4>
                                <Chip label={message.text}/>
                                </div>} />
                        </ListItem>
                        <Divider />
                        </div>
                    ))}
                    <ListItem ref={messagesEndRef}></ListItem>
                </List>
                <div>
                    <form>
                        <TextareaAutosize onChange={handleMessage} 
                            value={message}
                            minRows={3}
                            placeholder="Enter message"
                            style={{ width: "90%" }}/>
                        <input onChange={handleFiles} className="input" type="file" multiple/>

                        <button onClick={SendMessage} type="button">
                            send
                        </button> 
                    </form>
                </div>
            </div>
            );
}