import React from 'react';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <CustomCursor />
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;