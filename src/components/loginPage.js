import LoginForm from "./loginForm";
import SignUp from "./signUp";
import "./login.css";
import { React, useEffect, useState } from "react";

export default function Login(props) {
  let [userAuth, setUserAuth] = useState(0);
  function handleUser(auth) {
    setUserAuth(auth);
  }
  useEffect(() => {
    props.handleUser(userAuth);
    console.log("UserAuth: ", userAuth);
  });
  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="p-0 col-md-6 bg-light" id="left_side">
          {/* <div>Hello</div> */}
        </div>
        {/* <div className="col-sm-12 col-md-6 p-0 bg-light">
          <LoginForm handleUser={handleUser} />
        </div> */}
        <div className="col-sm-12 col-md-6 p-0 bg-light">
          <SignUp handleUser={handleUser} />
        </div>
      </div>
    </div>
  );
}
