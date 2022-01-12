import {React, useState} from "react";
import TextareaAutosize from '@mui/material/TextareaAutosize';

const axios = require('axios').default;


export default function SendMessageForm(props){
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const handleFiles = (e) => {
        setFiles(e.target.files);
      }

    const SendMessage = () => {
        const bodyFormData = new FormData();
        bodyFormData.append("Text", message);
        bodyFormData.append("ChatId", props.chatId);
        bodyFormData.append("FileCount", files.length);
        for(let idx = 0; idx < files.length; idx++){
            bodyFormData.append("Content", files[idx]);
        }
        axios({
            method: 'put',
            url: 'http://localhost:5050/api/Chat/addMessage/',
            headers:{
                "Content-Type":'multipart/form-data',
            },
            data: bodyFormData,
            })
            .then((response) => {
                props.signalRhub.invoke("MessageChanged", response.data.id).catch((e) => console.log(e));
                setMessage("");
            })
            .catch(
            (error) => {
                console.log(error);
            })
                   
    }
    return(
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
    );
}