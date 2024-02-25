import React,{useState} from "react";
import { Dialog } from 'primereact/dialog'

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import './profilePage.css';

function App({ signOut, user }) {
  const[imagecrop, setimagecrop] = useState(false);
  // const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(localStorage.getItem('profilePicture') || 'default-profile-picture-url');

  const profilePictures = [
    "https://i.imgur.com/qj4Daxo.png",
    "https://i.imgur.com/D0wrQ3z.png",
    "https://i.imgur.com/Ze3ya0W.png",
    "https://i.imgur.com/3oT5Gfq.png",
    "https://i.imgur.com/hzAggnO.png",
    "https://i.imgur.com/FcBItan.png",
  ];

  const handleProfilePictureClick = () => {
    setimagecrop(true);
  };

  const handleProfilePictureSelect = (pictureUrl) => {
    setSelectedProfilePicture(pictureUrl);
    localStorage.setItem('profilePicture', pictureUrl);
    setimagecrop(false);
  };
  return (
    <>
    <div class="container-fluid">
      <div class="row">
      <div class="left-div" className="col-md-6 d-none d-md-block bg-light" id="imageProfile"></div>
      <div class="right-div" className="p-0 col-md-6 bg-light" id="profileDesc">
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <img
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid black",
          }}
          onClick={handleProfilePictureClick}
          src={selectedProfilePicture || "default-profile-picture-url"}
          alt=""
        /><br></br>

      <Dialog
        visible={imagecrop}
        header={() => (
          <div className="custom-dialog-header">
            <p className="text-2xl font-semibold textColor">Choose new profile icon:</p>
            <div className="image-container">
              {profilePictures.map((pictureUrl) => (
                <img
                  key={pictureUrl}
                  src={pictureUrl}
                  alt=""
                  style={{
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    margin: "5px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onClick={() => handleProfilePictureSelect(pictureUrl)}
                />
              ))}
            </div>
          </div>
        )}
        onHide={() => setimagecrop(false)}
        style={{ width: "500px", display: "flex", flexDirection: "column" }} // Adjust the width as needed
        className="custom-dialog" // Add a custom class for styling
      >
        <style>
          {`
            .custom-dialog .p-dialog-content,
            .custom-dialog-header {
              background-color: #DCDCDC; /* Set your desired background color */
              border: 0.2px solid #1B1B1B; /* Set your desired border styles */
            }
            .custom-dialog-header {
              padding: 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-weight: bold;
            }
            .image-container {
              display: flex;
              justify-content: center;
              margin-top: 1rem;
            }
          `}
        </style>
        
        <div className="confirmation-content flex flex-column align-items-center flex-grow-1"></div>
      </Dialog>
          <div>
            <label htmlFor="" className="mt-3" style={{ fontWeight: 'bold', fontSize: 'larger' }}>{user.username}</label><br/>
            <label htmlFor="" className="mt-3 font-semibold text-5xl">Email:</label><br/>
            <label htmlFor="" className="mt-3 font-semibold text-5xl">Password: </label><br/>
            <label htmlFor="" className="mt-3 font-semibold text-5xl">Phone Number: </label><br/>
            <label htmlFor="" className="mt-3 font-semibold text-5xl">Streak: </label><br/>
            <label htmlFor="" className="mt-3 font-semibold text-5xl">Questions Practiced: </label><p><br/></p>
            <button onClick={signOut}>Sign out</button>
          </div>
        </div>
        </div>
        </div>
        </div>
    </>
  );
}

export default withAuthenticator(App);
