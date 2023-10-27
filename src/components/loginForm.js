import { Link } from "react-router-dom";
import "./loginForm.css";
import { Auth } from "aws-amplify";
import { useState, useEffect } from "react";

export default function LoginForm() {
  let [loginState, setLoginState] = useState({ stateID: 0, user: null });

  function get_height() {
    return document.getElementById("login_card").offsetHeight;
  }

  async function isLoggedIn() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async function handleLoginState(username, password) {
    if (loginState.stateID === 0) {
      setLoginState({ stateID: 1, user: null }); // show the loading screen
      try {
        // Commented AWS Part
        await Auth.signIn(username, password);
      } catch (e) {
        console.log("error signing in", e);
      }
    }
    let user = await isLoggedIn();
    if (user) {
      setLoginState({ stateID: 2, user: user }); // Successful Login
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
        }
      };
      checkUser();
    }
    console.log(loginState.stateID);
  });

  async function signIn(username = "", password = "") {
    try {
      handleLoginState(username, password);
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut({ global: true });
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
                <label className="text-center w-100">
                  <h1>MoodMentor</h1>
                  <h6 className="py-3">
                    Hello, welcome back!{" "}
                    {loginState.stateID === 2
                      ? "@" + loginState.user.attributes.preferred_username
                      : ""}
                  </h6>
                  <button
                    className={`${loginState.stateID === 0 ? "d-none" : ""}`}
                    onClick={signOut}
                  >
                    Sign Out
                  </button>
                </label>
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
                    signIn(
                      document.getElementById("inputEmail").value,
                      document.getElementById("inputPassword").value
                    )
                  }
                >
                  Login
                </button>
                <label className="text-center w-100">
                  Don't have an account yet?{" "}
                  <Link to={"#"}>Create account</Link>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
