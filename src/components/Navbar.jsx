import React from "react"
import { signOut } from 'firebase/auth'
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

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
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">SWExposures</a>
      </div>
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal px-1">
          <li><a>Products</a></li>
          <li><a>Articles</a></li>
          <li><a>Testimonials</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}
