import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const isInternal = location.pathname.startsWith('/internal');
  const isExternal = location.pathname.startsWith('/external');

  if (!isInternal && !isExternal) {
    return null; 
  }

  return (
    <div className={isInternal ? "sidebar-in" : "sidebar"}>
      {isInternal && (
        <>
          <Link 
            to="/internal/section1" 
            className={`sidebar-link ${location.pathname === '/internal/section1' ? 'active' : ''}`}
          >CCTV</Link>
          <Link 
            to="/internal/section2" 
            className={`sidebar-link ${location.pathname === '/internal/section2' ? 'active' : ''}`}
          >Health Care</Link>
        </>
      )}
      {isExternal && (
        <>
          <Link 
            to="/external/section1" 
            className={`sidebar-link ${location.pathname === '/external/section1' ? 'active' : ''}`}
          >
          CCTV</Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
