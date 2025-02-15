import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const faviconUrl =
    document.querySelector("link[rel~='icon']")?.getAttribute("href") ||
    "/favicon.ico";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://server.agungbot.my.id/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Use sessionStorage instead of localStorage
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-transparent">
      <div className="w-full max-w-xs p-6 border-2 border-purple-600 rounded-xl bg-gray-800 bg-opacity-70 shadow-lg" data-aos="fade-up" data-aos-duration="1000">
        <div className="flex flex-col items-center mb-4" data-aos="zoom-in" data-aos-delay="100">
          <img
            src={faviconUrl}
            alt="Logo"
            className="w-16 h-16 mb-2 rounded-full"
          />
          <h2 className="text-lg font-bold text-center text-white">Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4" data-aos="fade-right" data-aos-delay="200">
            <label htmlFor="identifier" className="block text-sm font-medium mb-1 text-gray-300">
              Email or Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-purple-400" />
              </span>
              <input
                type="text"
                id="identifier"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-10 p-2 bg-gray-800 border border-purple-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="relative mb-6" data-aos="fade-right" data-aos-delay="300">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-purple-400" />
              </span>
              <input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 p-2 bg-gray-800 border border-purple-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 rounded-lg transition duration-300"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-300" data-aos="fade-up" data-aos-delay="500">
          Belum punya akun?{" "}
          <Link to="/register" className="text-purple-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;