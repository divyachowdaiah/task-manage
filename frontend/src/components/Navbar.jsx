import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import './Navbar.css'; // Import CSS file

const Navbar = () => {
  const authState = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className='navbar-header'>
        <h2 className='navbar-title'>
          <Link to="/">Task Manager</Link>
        </h2>

        <ul className='navbar-menu'>
          {authState.isLoggedIn ? (
            <>
              <li className="navbar-button">
                <Link to='/tasks/add'> <i className="fa-solid fa-plus"></i> Add Task </Link>
              </li>
              <li className='navbar-link' onClick={handleLogoutClick}>Logout</li>
            </>
          ) : (
            <li className='navbar-link navbar-link-primary'><Link to="/login">Login</Link></li>
          )}
        </ul>

        <span className='navbar-icon md:hidden' onClick={toggleNavbar}>
          <i className="fa-solid fa-bars"></i>
        </span>

        {/* Sidebar for mobile menu */}
        <div className={`sidebar ${isNavbarOpen ? 'open' : ''}`}>
          <div className='sidebar-close' onClick={toggleNavbar}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul className='flex flex-col gap-4 uppercase font-medium text-center'>
            {authState.isLoggedIn ? (
              <>
                <li className="navbar-button">
                  <Link to='/tasks/add'><i className="fa-solid fa-plus"></i> Add Task</Link>
                </li>
                <li className='navbar-link' onClick={handleLogoutClick}>Logout</li>
              </>
            ) : (
              <li className='navbar-link navbar-link-primary'><Link to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
}

export default Navbar;
