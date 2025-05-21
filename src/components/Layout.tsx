
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Layout;
