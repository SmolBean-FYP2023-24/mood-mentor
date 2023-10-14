import { Link, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import TopNav from "./components/top_nav";

export default function App() {
  return (
    <>
      {/* <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav> */}
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
