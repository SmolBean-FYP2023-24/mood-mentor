import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./styles/profilePage.css";
import {dummyData} from './dummyData.js'

function ProfilePage(props) {
  const {
    id,
    username,
    password,
    streak,
    level,
    badges,
    speakingQuestion,
    listeningQuestion,
    conversationQuestion,
    hasOnboarded,
    speakingAccuracy,
    listeningAccuracy,
    conversationAccuracy,
  } = dummyData;
  const [userState, setUserState] = useState(0);
  useEffect(() => {
    const getUserData = async () => {
      const user = await fetchAuthSession();
      setUserState(user.tokens.idToken.payload);
      props.handleUser(user);
    };
    getUserData();
  }, [props]);
  const [imagecrop, setimagecrop] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(
    localStorage.getItem("profilePicture") || "default-profile-picture-url"
  );

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
    localStorage.setItem("profilePicture", pictureUrl);
    setimagecrop(false);
  };
  return (
    <>
      <div className="container-fluid p-0 w-100 h-100 text-center">
        <div className="row w-100 h-100 m-0">
          <div className="px-0 col-12 bg-light mt-3" id="profileDesc">
            <div
              className="w-100 h-25 bg-dark"
              style={{ position: "absolute", zIndex: 0, top: "56px" }}
            ></div>
            <div id="picHolder">
              <img
                style={{
                  zIndex: "1",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onClick={handleProfilePictureClick}
                src={selectedProfilePicture || "default-profile-picture-url"}
                alt=""
              />
              <div
                className="card w-75 h-75"
                style={{ position: "relative", top: "-5rem", zIndex: "0" }}
              >
                <div style={{ paddingTop: "12vh" }}>
                  <h2 className="pt-3">
                    {userState.given_name + " " + userState.family_name}
                  </h2>
                  <small>@{userState.preferred_username}</small>
                  <br />
                  <div className="container w-100 text-center">
                    <br></br>
                    <br></br>
                    <div className="row w-100">
                      <div className="col-6">
                        <span className="fw-italic d-none d-md-block">
                          Streak
                        </span>
                        <br></br>
                        <span className="display-2">{streak}</span>
                      </div>
                      <div className="col-6">
                        <span className="fw-italic d-none d-md-block">
                          Questions Practiced
                        </span>
                        <br></br>
                        <span className="display-2">##</span>
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <button
                    type="button"
                    className="btn btn-dark btn-large w-md-25 mt-md-5"
                    onClick={signOut}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                    &nbsp;Sign out
                  </button>
                  <br></br>
                </div>
              </div>

              <Dialog
                visible={imagecrop}
                header={() => (
                  <div className="custom-dialog-header">
                    <p className="text-2xl font-semibold textColor">
                      Choose new profile icon:
                    </p>
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
                            padding: "5px",
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
                style={{
                  width: "500px",
                  display: "flex",
                  flexDirection: "column",
                }} // Adjust the width as needed
                className="custom-dialog" // Add a custom class for styling
              >
                <div className="confirmation-content flex flex-column align-items-center flex-grow-1"></div>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuthenticator(ProfilePage);
