import { Link } from "react-router-dom";
import "./styles/loginForm.css";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decideCreateNewEntry } from "./create_init_user";
import { generateClient } from "aws-amplify/api";
import { createUserDataModel } from "../graphql/mutations";
import { initUserData } from "./data/initUserData";

export default function LoginForm(props) {
  const client = generateClient();
  let navigate = useNavigate();

  let [loginState, setLoginState] = useState({ stateID: 0, user: null });

  function get_height() {
    return document.getElementById("login_card").offsetHeight;
  }

  async function isLoggedIn() {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (e) {
      return false;
    }
  }

  async function handleLoginState(username, password) {
    if (loginState.stateID === 0) {
      setLoginState({ stateID: 1, user: null }); // show the loading screen
      try {
        await signIn({ username, password });
      } catch (e) {
        console.log("error signing in", e);
      }
    }
    let user = await isLoggedIn();
    if (user) {
      console.log(user);
      setLoginState({ stateID: 2, user: user }); // Successful Login
      if ((await decideCreateNewEntry()) === true) {
        let updatedInitUserData = initUserData;
        updatedInitUserData.username = user.userId;
        const output = await client.graphql({
          query: createUserDataModel,
          variables: {
            input: updatedInitUserData,
          },
        });
        console.log(output);
      }
      props.handleUser(1);
    } else {
      setLoginState({ stateID: 3, user: null }); // Error Logging In
    }
  }

  useEffect(() => {
    if (loginState.stateID === 0) {
      const checkUser = async () => {
        let user = await isLoggedIn();
        if (user) {
          setLoginState({ stateID: 2, user: user });
          props.handleUser(1);
        } else {
          props.handleUser(0);
        }
      };
      checkUser();
    }
  });

  async function mysignIn(username = "", password = "") {
    try {
      handleLoginState(username, password);
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  // async function viewProfile() {
  //   if (await isLoggedIn()) {
  //     navigate("/profile", );
  //   }
  // }

  async function mysignOut() {
    try {
      await signOut({ global: true });
      setLoginState({ stateID: 0, user: null });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  return (
    <>
      <div id="login_form" className="card border-0">
        <div className="row w-100">
          <div
            className="border rounded p-lg-5 p-3 mx-auto w-sm-100 w-md-75 position-xs-fixed bottom-0 position-md-inherit position-sm-fixed"
            id="login_card"
            style={
              loginState.stateID === 1 ? { height: get_height() + "px" } : {}
            }
          >
            <div
              className={`${
                loginState.stateID === 1 ? "all_middle" : "d-none"
              }`}
            >
              <div className="spin"></div>
            </div>
            <div className={`${loginState.stateID === 1 ? "d-none" : ""}`}>
              <div className={`mb-5`}>
                <div className="text-center w-100">
                  <h1>MoodMentor</h1>
                  <h6 className="py-3">
                    Hello, welcome back!{" "}
                    {loginState.stateID === 2
                      ? "@" + loginState.user.username
                      : ""}
                  </h6>
                  <button
                    type="button"
                    className={`${
                      loginState.stateID === 0
                        ? "d-none"
                        : "btn btn-large btn-dark mx-2"
                    }`}
                    onClick={mysignOut}
                    id="signOutBtn"
                  >
                    Sign Out
                  </button>
                  {/* <button
                    type="button"
                    className={`${
                      loginState.stateID === 0
                        ? "d-none"
                        : "btn btn-large btn-dark mx-2"
                    }`}
                    onClick={viewProfile}
                    id="profileBtn"
                  > */}
                  {/* Profile
                  </button> */}
                </div>
              </div>
              <div className={`${loginState.stateID === 2 ? "d-none" : ""}`}>
                <div className="mb-4">
                  <span className="small">Email</span>
                  <input
                    type="email"
                    className="form-control mt-1"
                    id="inputEmail"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-5">
                  <span className="small">Password</span>
                  <input
                    type="password"
                    className="form-control mt-1"
                    id="inputPassword"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-100 mb-4"
                  onClick={() =>
                    mysignIn(
                      document.getElementById("inputEmail").value,
                      document.getElementById("inputPassword").value
                    )
                  }
                >
                  Login
                </button>
                <label className="text-center w-100">
                  Don't have an account yet?{" "}
                  <Link to={"/profile"}>Create account</Link>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
