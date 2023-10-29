import { Route, Routes } from "react-router-dom";
import Home from "./components/homePage";
import Login from "./components/loginPage";
import TopNav from "./components/topNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Profile from "./components/profilePage";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

export default function App() {
  return (
    <>
      <TopNav />
      <div className="myspacer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}
