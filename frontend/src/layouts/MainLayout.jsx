import React from 'react';
import Navbar from '../components/Navbar';
import './MainLayout.css'; // Import CSS file

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
     
      <Navbar />
      {children} 
     <center><h6> <b>have a good day </b></h6></center> 
    </div>
  );
};

export default MainLayout;
