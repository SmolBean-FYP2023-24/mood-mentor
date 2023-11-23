// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// JS
import { Route, Routes } from "react-router-dom";
import Home from "./components/homePage";
import Login from "./components/loginPage";
import TopNav from "./components/topNav";
import Profile from "./components/profilePage";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { useEffect, useState } from "react";

Amplify.configure(awsconfig);

export default function App() {
  let [userAuth, setUserAuth] = useState(0);
  function handleUser(auth) {
    setUserAuth(auth);
  }
  useEffect(() => {
    console.log("UserAuth: ", userAuth);
  });
  return (
    <>
      <TopNav showLogin={userAuth} />
      <div className="myspacer">
        <Routes>
          <Route path="/" element={<Home handleUser={handleUser} />} />
          <Route path="/auth/" element={<Login handleUser={handleUser} />} />
          <Route path="/profile/" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}
