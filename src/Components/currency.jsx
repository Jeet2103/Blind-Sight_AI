import React,{useEffect,useState} from 'react';
import "../Home.css";
import { useMyContext } from '../Context';

const Currency = (props) => {
    const [currencyStream,setCurrencyStream]=useState(null);
    const {
        apiResponse,
        setApiResponse,
        stream,
        setStream,
        videoRef,
        isRecording,
        stopVidRecording,
      } = useMyContext();
    
      const startRecording = async () => {
        try {
          const currencyStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setCurrencyStream(currencyStream);
    
          // Wait for 2 seconds before starting to capture
          setTimeout(() => {
            videoRef.current.srcObject = currencyStream;
            videoRef.current.play();
            isRecording.current = true;
            // Capture a frame from the video
            setTimeout(() => {
              captureAndSendFrame();
            }, 1000);
          }, 2000); // Wait for 2 seconds
        } catch (error) {
          console.error("Error accessing camera:", error);
          isRecording.current = false;
        }
      };
    
      const captureAndSendFrame = async () => {
        try {
          if (!videoRef.current || !isRecording.current) return;
    
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas
            .getContext("2d")
            .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const frameDataURL = canvas.toDataURL("image/jpeg");
    
          const base64Frame = frameDataURL.split(",")[1];
    
    
          const response = await fetch("http://127.0.0.1:8000/currency", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imagedata: base64Frame }),
          });

    
          const data = await response.json();
          setApiResponse(JSON.stringify(data));
          console.log("API Response:", data);
          if (data) {
            stopRecording();
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
    
      const stopRecording = () => {
          console.log("Stop recording",currencyStream);
        if (currencyStream) {
          const tracks = currencyStream.getTracks();
          tracks.forEach((track) => track.stop());
          setCurrencyStream(null);
          videoRef.current.srcObject = null;
          isRecording.current=false;
        }
    
      };
    
      const sendData = () => {
        if(currencyStream){
          stopRecording();
        }
          props.onDataReceived(apiResponse);
      };
    
      useEffect(() => {
        startRecording();
        return () => {
          stopRecording();
        };
      }, []);

      // useEffect(()=>{
      //   console.log("stream: ",currencyStream);
      // },[currencyStream])
    
      useEffect(() => {
        if (!isRecording.current) {
          startRecording();
        }
        if(apiResponse){
          sendData();
        }
      }, [apiResponse]);

      return (
        <video
          className="video"
          ref={videoRef}
          style={{ display: "block", marginBottom: "10px" }}
        ></video>
      );
};

export default Currency;