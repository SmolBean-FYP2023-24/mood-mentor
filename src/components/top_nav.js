import { Link, NavLink } from "react-router-dom";
import "./top_nav.css";

function TopNav() {
  return (
    <div className="top_nav">
      <p><Link to={`/`}>MoodMentor</Link></p>
      <div className="menu">
        <NavLink to={`/`} className={({isActive, isPending}) => isActive ? 'linkActive' : ''}>Home</NavLink>
        <NavLink to={`/login`} className={({isActive, isPending}) => isActive ? 'linkActive' : ''}>Login</NavLink>
      </div>
    </div>
  );
}

export default TopNav;
