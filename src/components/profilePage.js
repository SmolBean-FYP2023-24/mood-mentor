import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./styles/profilePage.css";
import { dummyData } from "./dummyData.js";
import { generateClient } from "aws-amplify/api";
import * as subscriptions from "../graphql/subscriptions";
import * as mutations from "../graphql/mutations.js";
import * as queries from "../graphql/queries.js";

function ProfilePage(props) {
  // ---------------------------------------------------------------

  // Handle User Login State

  // ---------------------------------------------------------------
  const [userState, setUserState] = useState(0);
  useEffect(() => {
    const getUserData = async () => {
      const user = await fetchAuthSession();
      setUserState(user.tokens.idToken.payload);
      props.handleUser(user);
    };
    getUserData();
  }, [props]);

  // ---------------------------------------------------------------

  // Add Real Time Database Abilities

  // ---------------------------------------------------------------

  const [userDetails, setUserDetails] = useState(dummyData);
  const [trueBadges, setTrueBadges] = useState([]);
  const [totalQuestionsPracticed, setTotalQuestionsPracticed] = useState([]);
  const effectRan = useRef(false);
  const client = generateClient();

  useEffect(() => {
    const updateIt = async () => {
      if (effectRan.current === true) {
        return;
      }
      effectRan.current = true;
      let user1 = await client.graphql({
        query: queries.getUserDataModel,
        variables: {
          username: "owner", // replace with User Sub using fetchAuthSession | userState
        },
      });
      setUserDetails(user1["data"]["getUserDataModel"]);
      const cleanedUser = removeTypenameKey(user1);
      const badgeList = Object.entries(cleanedUser.data.getUserDataModel.badges)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
      setTrueBadges(badgeList);

      const speakingQuestions = Object.values(
        cleanedUser.data.getUserDataModel.SpeakingQuestions
      );
      const listeningQuestions = Object.values(
        cleanedUser.data.getUserDataModel.ListeningQuestions
      );
      const totalQuestionsPracticed =
        sum(speakingQuestions) + sum(listeningQuestions);
      setTotalQuestionsPracticed(totalQuestionsPracticed);
      console.log("done");
    };
    updateIt();
  });

  let onCreateSub;
  function setUpSubscriptions() {
    const variables = {
      filter: {
        username: { eq: "owner" }, // replace with User Sub using fetchAuthSession | userState
      },
    };
    onCreateSub = client
      .graphql({ query: subscriptions.onUpdateUserDataModel }, variables)
      .subscribe({
        next: ({ data }) => {
          console.log(data);
          setUserDetails(data["onUpdateUserDataModel"]);
        },
        error: (error) => console.warn(error),
      });
  }

  useEffect(() => {
    setUpSubscriptions();
    return () => {
      onCreateSub.unsubscribe();
    };
  }, []);

  async function updateUser(updateField, updateValue, nestedField = null) {
    try {
      const oldUser = await client.graphql({
        query: queries.getUserDataModel,
        variables: {
          username: "owner", // replace with User Sub using fetchAuthSession | userState
        },
      });

      const { getUserDataModel } = oldUser.data;
      const updatedUserData = {
        ...getUserDataModel,
      };
      if (nestedField) {
        updatedUserData[nestedField][updateField] = updateValue;
      } else {
        updatedUserData[updateField] = updateValue;
      }

      const keysToRemove = [
        "__typename",
        "_deleted",
        "_lastChangedAt",
        "createdAt",
        "updatedAt",
      ];
      const cleanedUserData = removeKeys(updatedUserData, keysToRemove);

      const cleanedUser = {
        data: {
          getUserDataModel: removeTypenameKey(cleanedUserData),
        },
      };

      console.log(cleanedUser.data.getUserDataModel);

      const badgeList = Object.entries(cleanedUser.data.getUserDataModel.badges)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
      setTrueBadges(badgeList);

      const speakingQuestions = Object.values(
        cleanedUser.data.getUserDataModel.SpeakingQuestions
      );
      const listeningQuestions = Object.values(
        cleanedUser.data.getUserDataModel.ListeningQuestions
      );
      const totalQuestionsPracticed =
        sum(speakingQuestions) + sum(listeningQuestions);
      setTotalQuestionsPracticed(totalQuestionsPracticed);

      const updatedUser = await client.graphql({
        query: mutations.updateUserDataModel,
        variables: { input: cleanedUser.data.getUserDataModel },
      });

      console.log("User updated successfully:", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  function removeTypenameKey(obj) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(removeTypenameKey);
    }

    const newObj = {};
    for (const key in obj) {
      if (key !== "__typename") {
        newObj[key] = removeTypenameKey(obj[key]);
      }
    }
    return newObj;
  }

  function removeKeys(obj, keys) {
    const newObj = { ...obj };
    keys.forEach((key) => {
      delete newObj[key];
    });
    return newObj;
  }

  function sum(arr) {
    return arr.reduce((sum, value) => sum + value, 0);
  }

  // ---------------------------------------------------------------

  // Profile Picture Utility

  // ---------------------------------------------------------------

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
              className="w-100 h-25 bg-clr-profile"
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
              <button
                className="mt-5 btn btn-large btn-primary"
                onClick={() => updateUser("Fear", 55, "SpeakingQuestions")}
                style={{
                  position: "fixed",
                  bottom: "0",
                  right: "0",
                  zIndex: 9999,
                }}
              >
                Update User
              </button>
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
                        <span className="display-5">
                          {userDetails["streak"]}
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="fw-italic d-none d-md-block">
                          Questions Practiced
                        </span>
                        <br></br>
                        <span className="display-5">
                          {totalQuestionsPracticed}
                        </span>
                      </div>
                      <div className="col-6">
                        <br></br>
                        <span className="fw-italic d-none d-md-block">
                          Level
                        </span>
                        <br></br>
                        <span className="display-5">
                          {userDetails["level"]}
                        </span>
                      </div>
                      <div className="col-6">
                        <br></br>
                        <span className="fw-italic d-none d-md-block">
                          Number of Badges
                        </span>
                        <br></br>
                        <span className="display-5">{trueBadges.length}</span>
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <button
                    type="button"
                    className="btn btn-clr btn-dark btn-large w-md-25 mt-md-5"
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
                }}
                className="custom-dialog"
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
