// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
// JS
import { Route, Routes } from "react-router-dom";
import Home from "./components/homePage";
import Login from "./components/loginPage";
import TopNav from "./components/topNav";
import Profile from "./components/profilePage";
import ListeningExercise from "./components/ListeningExercise";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";
import { useEffect, useState } from "react";

Amplify.configure(amplifyconfig, {
  ssr: true,
});

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
          <Route path="/listeningexercise/" element={<ListeningExercise />} />
        </Routes>
      </div>
    </>
  );
}
