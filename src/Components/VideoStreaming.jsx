import { React, useState, useEffect, useRef } from "react"

const signalR = require('@microsoft/signalr');

export default function VideoStreaming(){

    const mimeType = "video/webm;codecs=vp8,opus";

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

        useEffect(() => {
            if(signalRhub){
                const subject = new signalR.Subject();

                const getFrame = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.current.videoWidth;
                    canvas.height = video.current.videoHeight;
                    canvas.getContext('2d').drawImage(video.current, 0, 0);
                    const data = canvas.toDataURL('image/png');
                    return data;
                }

                navigator.mediaDevices.getUserMedia({video: {width: 426, height: 240}}).then((stream) => video.current.srcObject = stream);
                //const constraints = { video: true };

                signalRhub.send("UploadStream", subject).catch(() => {
                    setSignalRState(false);
                });


                const FPS = 3;
                setInterval(() => {
                    const base64img = getFrame();
                    const sliceSize = 150;
                    
                    for(let idx = 0; base64img.length > sliceSize * idx; idx++)
                    {
                        subject.next(base64img.slice(idx * sliceSize, (idx + 1) * sliceSize));
                    }
                    subject.next("&&&");
                }, 1000 / FPS);

                // navigator.mediaDevices
                // .getUserMedia(constraints)
                // .then((mediaStream) => {
                //     const recorder = new MediaRecorder(mediaStream, {
                //         audioBitsPerSecond : 0,
                //         videoBitsPerSecond : 100000,
                //         mimeType: mimeType
                //       });

                //     recorder.ondataavailable = async (event) => {
                //         const stream = await event.data.stream();
                //         const reader = stream.getReader();
                //         reader.read().then(({ done, value }) => {
                //             const sliceSize = 3000;

                //             for(let idx = 0; value.length > sliceSize * idx; idx++)
                //             {
                //                 subject.next(value.slice(idx * sliceSize, (idx + 1) * sliceSize).toString());
                //             }
                            
                //         });
                        
                //     };
                //     recorder.start(1000);
                //     return () => recorder.stop();
                // });
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

        const [mediaSegments, setMediaSegments] = useState({segments:[]});
        const [mediaSource, setMediSource] = useState(new MediaSource());
        const [sourceBuffer, setSourceBuffer] = useState(null);
        const video = useRef(null); 

        useEffect(() => {
            if(sourceBuffer)
            {
                sourceBuffer.addEventListener('updateend', onUpdateEnd);
                console.log('3');
            }
        }, [sourceBuffer]);

        const mediaSourceOpen = () => {
            setSourceBuffer(mediaSource.addSourceBuffer(mimeType));    
            console.log('2');
        }
          
        const onUpdateEnd = () => {
            if (!mediaSegments.segments.length) {
              return;
            }

            sourceBuffer.appendBuffer(mediaSegments.segments.shift());
            console.log('4');
          }

        const Play = () => {
            let base64img = "";
            signalRhub?.stream("DownloadStream").subscribe({
                next: (item) => {
                    //const byteArray = new Uint8Array(JSON.parse("[" + item + "]"));
                    //mediaSegments.segments = mediaSegments.segments.concat(byteArray);
                    if(item === "&&&"){
                        video.current.src = base64img;
                        base64img = "";
                    }
                    else{
                        base64img += item;
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });

            // mediaSource.addEventListener('sourceopen', () => mediaSourceOpen());
            // video.current.src = window.URL.createObjectURL(mediaSource);  
            // console.log('1');
        }

        return (
            <div>
                <button type="button" onClick={Play}>Play</button>
                <button type="button" onClick={onUpdateEnd}>Update</button>
                recieved
                <video ref={video}></video>
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