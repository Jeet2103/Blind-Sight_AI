import React, { useState, useRef, useEffect} from "react";
import "./Home.css";
import gif from "/gif/jarvis.gif";
import logo from "/images/Logo.png";

const Home=()=>{
    const [recording, setRecording] = useState(false);
    const [streamAudio, setStreamAudio] = useState(null);
    const [audio1] = useState(new Audio("./sound/start.mp3"));
    const [audio2] = useState(new Audio("./sound/end.mp3"));
    const [version, setVersion] = useState(null);
    const scrollDiv = useRef(null);
    const prompt1 = "How can I help you?";
    const intro =
      "Hi! My name is BlindSightAI. I am designed to assist visually impaired people";
    const [messages, setMessages] = useState([{ text: intro, user: "AI" }]);


    // Function to animate the voice prompt letter by letter
    const animateVoicePrompt = (textElement) => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setVoicePrompt(textElement.slice(0, currentIndex + 1));
      currentIndex++;
    }, 70); 
  };

    const startRecording = async () => {
        try {
          const audioStreamAudio = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          setStreamAudio(audioStreamAudio);
          setRecording(true);
          audio1.play();
    
          let SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          let recognition = new SpeechRecognition();
          recognition.lang = "en-US";
    
          recognition.onresult = (event) => {
            const result = event.results[0][0];
            const transcript = result.transcript;
            const objUser = { text: transcript, user: "User" };
            setMessages((prevMessages) => [...prevMessages, objUser]);
            voiceText.current = transcript;
          };
    
          recognition.onend = () => {
            setRecording(false);
          };
    
          recognition.start();
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      };

    const speakPrompt = (text) => {
        return new Promise((resolve) => {
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = resolve;
          synth.speak(utterance);
        });
      };

      const stopRecording = () => {
        if (streamAudio) {
          streamAudio.getTracks().forEach((track) => track.stop());
        }
        setStreamAudio(null);
        setRecording(false);
        audio2.play();
      };

      return (
        <>
            <div>BLINDSIGHTAI</div>
            <div>Chat Section</div>
        </>
      )
}

export default Home;