import { React, useState, useEffect, useRef } from "react"
import ConfirmationDialog from "./AddVideoChatDialog";

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
    
        const video = useRef(null);

        const getFrame = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.current.videoWidth;
            canvas.height = video.current.videoHeight;
            canvas.getContext('2d').drawImage(video.current, 0, 0);
            const data = canvas.toDataURL('image/png');
            return data;
        }

        useEffect(() => {
            if(signalRhub){
                const VideoSubject = new signalR.Subject();
                // const SoundSubject = new signalR.Subject();
                const FPS = 10;

                signalRhub.send("UploadStream", VideoSubject).catch(() => {
                    setSignalRState(false);
                });

                // signalRhub.send("UploadSoundStream", SoundSubject).catch(() => {
                //     setSignalRState(false);
                // });

                let mediastream = null;
                // let recorder = null;

                navigator.mediaDevices.getUserMedia({video: {width: 426, height: 240}, audio: true}).then((stream) => {
                    video.current.srcObject = stream;
                    video.current.volume = 0;
                    mediastream = stream;

                    // recorder = new MediaRecorder(stream, { mimeType:"audio/webm" });

                    // recorder.ondataavailable = (e) => {
                    //     const reader = new FileReader();
                    //     const sliceSize = 500;

                    //     reader.onloadend = () => {
                    //         for(let idx = 0; reader.result.length > sliceSize * idx; idx++){
                    //             SoundSubject.next(reader.result.slice(idx * sliceSize, (idx + 1) * sliceSize));
                    //         }
                    //         SoundSubject.next("&&&");
                    //     }
                
                    //     reader.readAsDataURL(e.data);
                    // }

                    // recorder.start(10000);

                    
                });

                const VideoStop = setInterval(() => {
                    const base64img = getFrame();
                    const sliceSize = 500;
                    
                    for(let idx = 0; base64img.length > sliceSize * idx; idx++)
                    {
                        VideoSubject.next(base64img.slice(idx * sliceSize, (idx + 1) * sliceSize));
                    }
                    VideoSubject.next("&&&");

                }, 1000 / FPS);



                return () => {
                    clearInterval(VideoStop);
                    // recorder.stop();
                    mediastream?.getTracks().forEach((track) => {
                        track.stop();
                    });
                };
            }
        }, [signalRhub]);

        return (
            <div>
                send
                <video ref={video} autoPlay></video>
            </div>
            );
    }
    

    
    const Recieve = () => {
        const [signalRhub, setSignalR] = useState(null);
        const [signalRState, setSignalRState] = useState(true);
        const [base64img] = useState({img:""});
        // const [base64snd] = useState({snd:""});
        const video = useRef(null); 
        // const sound = useRef(null); 

        useEffect(() => {
            const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5050/hubs/videoStreaming", {
            accessTokenFactory: () => localStorage.getItem("jwtToken"),
            transport: signalR.HttpTransportType.hubConnection,
            })
            .build();

            hubConnection.on('Notify', (e) => {
                console.log(e);
            });

            hubConnection.on('VideoPart', (item) => {
                if(item === "&&&"){
                    video.current.src = base64img.img;
                    base64img.img = "";
                }
                else{
                    base64img.img += item;
                }
                
            });

            // hubConnection.on('SoundPart', (item) => {
            //     if(item === "&&&"){
            //         console.log(base64snd.snd);
            //         sound.current.src = base64snd.snd;
            //         sound.current.play();
            //         base64snd.snd = "";
            //     }
            //     else{
            //         base64snd.snd += item;
            //     }
                
            // });

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


        return (
            <div>
                <ConfirmationDialog signalR={signalRhub}/>
                recieved
                <img ref={video}></img>
                {/* <audio ref={sound} autoPlay></audio> */}
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