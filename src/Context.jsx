import React, { createContext, useContext, useState,useRef } from 'react';

// Create a context for the data
const MyContext = createContext();

// Create a Context Provider component
export function MyProvider({ children }) {
    const [location, setLocation] = useState(null);
    const [stream, setStream] = useState(null);
    const [apiResponse, setApiResponse] = useState('');
    const videoRef = useRef(null);
    const isRecording = useRef(false);
    const [coordinates,setCoordinates]=useState({lat:'',long:''});
    const apiBody=useRef({address:'',lat:'',long:''});

    const getLocation = () => {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
    
                setCoordinates({ lat: latitude, long: longitude });
                console.log(coordinates);
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const data = await response.json();
                const placeName = data.display_name;
                setLocation(placeName);
                apiBody.current={address:placeName,lat:latitude,long:longitude};
    
                // Resolve the Promise with the placeName
                resolve(placeName);
              } catch (error) {
                console.error('Error fetching location:', error);
                reject(error);
              }
            },
            (error) => {
              console.error('Error getting location:', error);
              reject(error);
            }
          );
        } else {
          console.error('Geolocation is not available in this browser.');
          reject(new Error('Geolocation is not available.'));
        }
      });
    };
    

    const stopVidRecording = () => {
        console.log("stop");
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          videoRef.current.srcObject = null;
          isRecording.current = false;
        }
      };

  // Create an object with the data and functions to provide
  const contextValue = {
    location,setLocation,stopVidRecording,stream,setStream,apiResponse,setApiResponse,videoRef,isRecording,getLocation,coordinates,apiBody
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

// Create custom hooks to access the context
export function useMyContext() {
  return useContext(MyContext);
}