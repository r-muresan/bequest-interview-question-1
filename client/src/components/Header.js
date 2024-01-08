// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#e3f2fd', justifyContent: 'flex-end' }}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/view">View</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/edit">Edit</Link>
        </li>
        <li className="nav-item">
          <button className="btn btn-link nav-link" onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
