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