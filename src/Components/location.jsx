import React, { useState, useEffect } from 'react';
import { useMyContext } from '../Context';

const CurrentLocation = (props) => {
  const {location,setLocation,getLocation}=useMyContext();
  const sendData=()=>{
    console.log("Location:",location);
    if(location){
    props.onDataReceived(location);
    }
  }

  useEffect(() => {
    // Check if the Geolocation API is available in the browser
      getLocation();
    if(location){
      sendData();
    }
  }, [location]);

  return (
    <></>
  );
};

export default CurrentLocation;