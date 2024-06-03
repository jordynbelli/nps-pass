import React, { useState } from 'react';
import { useAuthContext } from '../AuthContext';
import './navbar.css';

function Navbar() {
  const { setIsAuthenticated } = useAuthContext();
  const [logoutMessage, setLogoutMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setLogoutMessage('Successfully logged out');
    setTimeout(() => {
      setLogoutMessage('');
      window.location.href = '/';
    }, 2000); // Display message for 2 seconds before redirecting
  };

  return (
    <nav className="navbar">
      <ul className="navbar-left">
        <li><a href="/">Home</a></li>
        <li><a href="/about">Usage</a></li>
        <li><a href="/findapark">Find a Park</a></li>
        <li><a href="/purchase">Purchase ExpressPass</a></li>
        <li className="dropdown">
          <button className="dropbtn">Account Info</button>
          <div className="dropdown-content">
            <a href="/register">Register</a>
            <a href="/login">Log In</a>
            <a href="/activate">Activate Your ExpressPass</a>
            <a href="/" onClick={handleLogout}>Log Out</a>
          </div>
        </li>
      </ul>
      {logoutMessage && <p className="logout-message">{logoutMessage}</p>}
    </nav>
  );
}

export default Navbar;

