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

      const voiceNav = async (text) => {
        text = text.toLowerCase();
        console.log("voice :", text);
        const roadAssist = [
          "road",
          "walk",
          "assist",
          "outside",
          "street",
          "stroll",
          "outdoors",
        ];
        const location = ["current", "location", "where", "place"];
        const facialRecog = ["who", "recognize", "face", "know", "recognition"];
        const currency = [
          "currency",
          "note",
          "value",
          "identify",
          "rupees",
          "cash",
          "money",
        ];
        const contact = [
          "help",
          "hospital",
          "doctor",
          "accident",
          "call",
          "ambulance",
        ];
        const features = ["features", "available", "what can u do", "tell"];
        for (let i = 0; i < roadAssist.length; i++) {
          const item = roadAssist[i];
          if (text.includes(item)) {
            setVersion("roadAssist");
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "Entering Road Assist Mode. Hold your camera upright. Let's embark on your journey",
                user: "AI",
              },
            ]);
            speakPrompt("Entering Road Assist Mode.");
            speakPrompt("Hold your camera upright");
            speakPrompt("Let's embark on your journey");
            if (apiResponse) {
              setApiResponse("");
            }
            break;
          }
        }
    
        for (let i = 0; i < location.length; i++) {
          const item = location[i];
          if (text.includes(item)) {
            setVersion("location");
            if (location) {
              setLocation(null);
            }
            break;
          }
        }
    
        for (let i = 0; i < facialRecog.length; i++) {
          const item = facialRecog[i];
          if (text.includes(item)) {
            setVersion("faceRecog");
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Face your camera towards the person.", user: "AI" },
            ]);
            speakPrompt("Face your camera towards the person.");
            if (apiResponse) {
              setApiResponse("");
            }
            break;
          }
        }
    
        for (let i = 0; i < contact.length; i++) {
          const item = contact[i];
          if (text.includes(item)) {
            getLocation();
            while (!location) {
              getLocation();
            }
            smsalert();
            setVersion(null);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: `Sending an alert message to your nearest hospital`,
                user: "AI",
              },
            ]);
            speakPrompt(`Sending an alert message to your nearest hospital`);
            break;
          }
        }
    
        for (let i = 0; i < currency.length; i++) {
          const item = currency[i];
          if (text.includes(item)) {
            setVersion("currency");
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Face your camera towards the note", user: "AI" },
            ]);
            speakPrompt("Face your camera towards the note");
            if (apiResponse) {
              setApiResponse("");
            }
            break;
          }
        }
    
        for (let i = 0; i < features.length; i++) {
          const item = features[i];
          if (text.includes(item)) {
            setVersion(null);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "Hello, I'm Blind Sight AI, your reliable companion in the world of sightless navigation. With a simple click of the button, I am here to empower you with a host of life-enhancing features.",
                user: "AI",
              },
            ]);
            await speakPrompt(
              "Hello, I'm Blind Sight AI, your reliable companion in the world of sightless navigation. With a simple click of the button, I am here to empower you with a host of life-enhancing features."
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "As you step outside, I become your vigilant guide, alerting you to approaching vehicles, cyclists, and pedestrians. With clear, reassuring voice commands, I ensure your safe passage on the road.",
                user: "AI",
              },
            ]);
            await speakPrompt(
              "As you step outside, I become your vigilant guide, alerting you to approaching vehicles, cyclists, and pedestrians. With clear, reassuring voice commands, I ensure your safe passage on the road."
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "Need assistance with currency recognition? Just ask, and I'll swiftly scan and read aloud the values of your banknotes, making financial transactions a breeze.",
                user: "AI",
              },
            ]);
            await speakPrompt(
              "Need assistance with currency recognition? Just ask, and I'll swiftly scan and read aloud the values of your banknotes, making financial transactions a breeze."
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "Curious about your current whereabouts? At your command, I can provide you with your precise location, so you always know where you are.",
                user: "AI",
              },
            ]);
            await speakPrompt(
              "Curious about your current whereabouts? At your command, I can provide you with your precise location, so you always know where you are."
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "Recognizing familiar faces and names is my specialty. I'll help you identify your loved ones by reading their names aloud, fostering deeper connections.",
                user: "AI",
              },
            ]);
            await speakPrompt(
              "Recognizing familiar faces and names is my specialty. I'll help you identify your loved ones by reading their names aloud, fostering deeper connections."
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "In times of distress, a simple 'Help me' is all it takes. I'll immediately dispatch an SMS alert to the nearest hospital, sharing your exact coordinates and address, ensuring help arrives when you need it most.",
                user: "AI",
              },
            ]);
            await speakPrompt(
              "In times of distress, a simple 'Help me' is all it takes. I'll immediately dispatch an SMS alert to the nearest hospital, sharing your exact coordinates and address, ensuring help arrives when you need it most."
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "With Blind Sight AI, your independence and confidence are just a voice command away.",
                user: "AI",
              },
            ]);
            await speakPrompt(
              "With Blind Sight AI, your independence and confidence are just a voice command away."
            );
            break;
          }
        }
    
        if (text.includes("stop")) {
          stopVidRecording();
          setVersion(null);
        }
      };

      return (
        <>
            <div>BLINDSIGHTAI</div>
            <div>Chat Section</div>
        </>
      )
}

export default Home;