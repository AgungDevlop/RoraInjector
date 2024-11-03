import React from 'react';
import { FaPlay } from 'react-icons/fa'; // Import ikon play dari react-icons

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-orange-500 fixed top-0 left-0 w-full p-4 text-black text-center flex items-center justify-center">
        <FaPlay className="mr-2" /> {/* Tambahkan ikon play */}
        <h1 className="text-2xl font-bold">DoobStream</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 text-white pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-orange-500 p-4 text-black text-center">
        <p>© 2024 DoobStream. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
