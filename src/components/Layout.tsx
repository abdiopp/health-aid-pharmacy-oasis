import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import { useAuth } from "@/contexts/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Chatbot email={user?.email} />
      <Footer />
    </div>
  );
};

export default Layout;
