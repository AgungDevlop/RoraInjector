import React, { useState } from 'react';
import { FaPlay, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-orange-500 fixed top-0 left-0 w-full p-4 text-black text-center flex items-center justify-center">
        <FaPlay className="mr-2" /> {/* Ikon play */}
        <h1 className="text-2xl font-bold">DoobStream</h1>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-black p-3 rounded-lg shadow-lg flex items-center justify-between space-x-4 w-[90%] max-w-3xl">
          <div className="flex items-center space-x-3">
            <FaDownload size={24} className="text-black" /> {/* Ikon APK */}
            <span className="font-semibold">Install DoobStream Apk</span>
          </div>
          <Link
            to="https://github.com/AgungDevlop/Viral/raw/refs/heads/main/DoobStream.apk"
            className="bg-black text-white px-3 py-1 rounded font-medium"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Install
          </Link>
          <button onClick={() => setShowToast(false)} className="text-black ml-2 text-xl font-bold">
            &times;
          </button>
        </div>
      )}

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
