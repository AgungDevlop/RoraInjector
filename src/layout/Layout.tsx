import { FaUpload } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className="fixed top-0 left-0 w-full p-4 text-white flex items-center justify-between z-50"
        style={{ background: 'radial-gradient(circle at top right, #4b0082, #1c002c)' }}
      >
        <div className="flex items-center">
          <FaUpload className="mr-2 text-xl" />
          <h1 className="text-2xl font-bold">VideHost</h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="mr-2 bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Upload
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 text-white pt-20"
        style={{ background: 'radial-gradient(circle at center, #1c002c, #0c0016)' }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
