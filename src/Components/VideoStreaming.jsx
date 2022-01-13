import { React, useState, useEffect } from "react"

const signalR = require('@microsoft/signalr');

export default function VideoStreaming(){

    const Send = () => {
        const [signalRhub, setSignalR] = useState(null);
        const [signalRState, setSignalRState] = useState(true);

        useEffect(() => {
            const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5050/hubs/videoStreaming", {
            accessTokenFactory: () => localStorage.getItem("jwtToken"),
            transport: signalR.HttpTransportType.hubConnection,
            })
            .build();
            hubConnection.start()
            .then(() =>  
            {  
                setSignalR(hubConnection);
                setSignalRState(true);
            }).catch(() => {
                
                setSignalRState(false);
            });
            return () => {hubConnection.stop()}
      
        }, [signalRState]);
    
        useEffect(() => {
            if(signalRhub){
                const subject = new signalR.Subject();
                const constraints = { video: true };

                signalRhub.send("UploadStream", subject).catch(() => setSignalRState(false));

                navigator.mediaDevices
                .getUserMedia(constraints)
                .then((mediaStream) => {
                    const recorder = new MediaRecorder(mediaStream, {
                        audioBitsPerSecond : 0,
                        videoBitsPerSecond : 100000,
                      });

                    recorder.ondataavailable = async (event) => {
                        subject.next(JSON.stringify(await event.data.text()));
                    };
                    recorder.start(30);
                });
            }
        }, [signalRhub]);

        return null;
    }
    

    
    const Recieve = () => {
        const [signalRhub, setSignalR] = useState(null);
        const [signalRState, setSignalRState] = useState(true);

        useEffect(() => {
            const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5050/hubs/videoStreaming", {
            accessTokenFactory: () => localStorage.getItem("jwtToken"),
            transport: signalR.HttpTransportType.hubConnection,
            })
            .build();
            hubConnection.start()
            .then(() =>  
            {  
                setSignalR(hubConnection);
                setSignalRState(true);
            }).catch(() => {
                
                setSignalRState(false);
            });
            return () => {hubConnection.stop()}
      
        }, [signalRState]);

        const Play = () => {
            signalRhub?.stream("DownloadStream").subscribe({
                next: async (item) => {
                    console.log(JSON.parse(item));
                },
                error: (err) => {
                    console.log(err);
                },
            });
        }

        return (
            <div>
                <button type="button" onClick={Play}>Play</button>
            </div>
        );

    }

    
    return (
        <div>
            <Send/>
            <Recieve/>
        </div>
    );
}