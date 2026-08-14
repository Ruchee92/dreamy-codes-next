import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
