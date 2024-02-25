import React, { useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import './profilePage.css';
import { getProfilePicture } from './profilePageUtils.js';


const emotions={
    1:'neutral', 
    2:'happy', 
    3:'sad', 
    4:'angry',
    5:'fear',
    6:'disgust'
  };
  const selectedProfilePicture = getProfilePicture();

  function Dashboard({user}) {
    return (
      <div>
        <img
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid black",
            }}
            src={selectedProfilePicture}
            alt=""
          />
          <div>
              <label htmlFor="" className="mt-3" style={{ fontWeight: 'bold', fontSize: 'larger' }}>Name: {user}</label><br/>
              <label htmlFor="" className="mt-3 font-semibold text-5xl">Level: </label><br/>
          </div>
      </div>
    );
  }

export default Dashboard;