import {React, useState, useEffect, createRef} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextareaAutosize from '@mui/material/TextareaAutosize';
// import Container from '@mui/material/Container';
// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';

const signalR = require('@microsoft/signalr');

export default function ShowChat(props) {
    const [signalRhub, setSignalR] = useState(null);
    const [signalRState, setSignalRState] = useState(true);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    // const [files, setFiles] = useState([]);

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }
    // const handleFiles = (e) => {
    //     setFiles(e.target.files);
    // }
    
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
                setMessages([...messages, e]);
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
                setMessages(props.chat.messages);
                setSignalR(hubConnection);
                setSignalRState(true);
            }).catch(() => {
                setSignalRState(false);
            });

            return () => {hubConnection.stop()}
    }
      
    }, [signalRState, props]);

      

      const SendMessage = () => {
        let data = {};
        data["Text"] = message;
        data["ChatId"] = props.chat.id;
        // data["Content"] = [];
        // for(let idx = 0; idx < files.length; idx++){
        //     data["Content"].push(files[idx]);
        // }
        signalRhub.invoke("AddMessage", data).catch((e) => { console.log(e); });
        }

    //   const ShowContent = (content) => {
    //     if(!content)return null;
    //     return (
    //         <Container maxWidth="sm">
    //         <ImageList sx={{ width: 350, height: 450 }} cols={3} rowHeight={164}>
    //         {content.map((file) => 
    //             <ImageListItem key={file}>
    //             <img src={file + "?access_token=" + localStorage.getItem("jwtToken")} width="50%" height="50%" alt={file}/>
    //             </ImageListItem>
    //         )}
    //         </ImageList>
    //         </Container>
    //     );
    //     }

    const ShowMessages = (props) => {
        const messagesEndRef = createRef();

      useEffect(() => {
          if(messagesEndRef.current)
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: "end"});
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
                    <ListItemText primary={
                        <div>
                        <h4>{message.from}</h4>
                        <Chip label={message.text}/>
                        </div>} />
                        {/* { ShowContent(message.content) } */}
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
                <div>
                    <form>
                        <TextareaAutosize onChange={handleMessage} 
                            value={message}
                            minRows={3}
                            placeholder="Enter message"
                            style={{ width: "90%" }}/>
                        {/* <input onChange={handleFiles} className="input" type="file" multiple/> */}

                        <button onClick={SendMessage} type="button">
                            send
                        </button> 
                    </form>
                </div>
            </div>
            );
}