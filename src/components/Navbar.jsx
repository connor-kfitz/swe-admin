import React from "react"
import { signOut } from 'firebase/auth'
import { auth } from "../firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout(event) {
    event.preventDefault();
    try {
      await signOut(auth);
      navigate("/login");
    } catch {
      console.log('Failed to Logout');
    }
  }

  return (
    <nav className="navbar bg-base-100 max-w-7xl m-auto">
      <div className="navbar-start text-xl font-medium">
        SWExposures
      </div>
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal px-1">
          <li className="mr-3"><Link className={location.pathname === "/products" ? "active" : ""} to="/products">Products</Link></li>
          <li className="mr-3"><Link className={location.pathname === "/articles" ? "active" : ""} to="/articles">Articles</Link></li>
          {/* <li><Link className={location.pathname === "/testimonials" ? "active" : ""} to="/testimonials">Testimonials</Link></li> */}
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}
