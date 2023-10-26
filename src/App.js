import { Link, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import TopNav from "./components/top_nav";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  return (
    <>
      <TopNav />
      <div className="myspacer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}
